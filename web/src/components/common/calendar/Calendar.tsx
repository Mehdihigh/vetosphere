import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/event.css';
import AddEventPopup from '../../../features/event/event/AddEventPopup.tsx';
import DisplayWorkerSectionPopup from '../../../features/event/workerSection/DisplayWorkerSectionPopup.tsx';
import { useEvent } from '../../../hooks/event/useEvent.ts';
import { useFetchWorkerSectionByVeterinarian } from '../../../hooks/event/useWorkerSection.ts';
import { deleteEventById } from '../../../services/api/event/eventApi';
import { removeBlackBackground } from '../../../utils/blackBakground.ts';
import { formatTime } from '../../../utils/dateManager.ts';

const dayMapping = {
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
  dimanche: 0,
};

const Calendar = ({ initialView, className, datesSet }) => {
  const calendarRef = useRef(null);
  const [displayWorkerSectionPopup, setDisplayWorkerSectionPopup] = useState(false);
  const { eventList, fetchEventByVeterinarian, addEvent } = useEvent();
  const { workerSections, fetchWorkerSectionByVeterinarian, addWorkerSection, updateWorkerSectionById, destroyWorkerSectionById } =
    useFetchWorkerSectionByVeterinarian();

  const [businessHours, setBusinessHours] = useState([]);
  const [tooltipEvent, setTooltipEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [displayAddEventPopup, setDisplayAddEventPopup] = useState(false);
  const [dateSelected, setDateSelected] = useState('');
  const [view, setView] = useState(initialView);
  const [filters, setFilters] = useState({ type: '', client: '', animal: '' });
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [contextEvent, setContextEvent] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);

  const navigate = useNavigate();
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleEventRightClick = (info, e) => {
    e.preventDefault();
    setContextEvent(info.event);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const filteredEvents = eventList
    .map((evt) => ({
      id: evt.id,
      title: `${evt.animal?.name || 'Animal inconnu'} - ${evt.description || 'Sans description'}`,
      start: evt.start_date,
      end: evt.end_date,

      extendedProps: {
        animalName: evt.animal?.name || 'Inconnu',
        clientName: evt.animal?.client?.userAccount
          ? `${evt.animal.client.userAccount.first_name} ${evt.animal.client.userAccount.last_name}`
          : 'Client inconnu',
        description: evt.description || 'Pas de description',
        type: evt.type || '',
        id_client: evt.animal?.id_client,
      },
    }))
    .filter((evt) => {
      return (
        (!filters.type || evt.extendedProps.type === filters.type) &&
        (!filters.client || evt.extendedProps.clientName.toLowerCase().includes(filters.client.toLowerCase())) &&
        (!filters.animal || evt.extendedProps.animalName.toLowerCase().includes(filters.animal.toLowerCase()))
      );
    });

  useEffect(() => {
    fetchWorkerSectionByVeterinarian();
    fetchEventByVeterinarian();
  }, [datesSet]);

  useEffect(() => {
    if (!Array.isArray(workerSections) || workerSections.length === 0) {
      setBusinessHours([{ daysOfWeek: [6], startTime: '14:17:00', endTime: '14:18:00' }]);
      return;
    }
    const updatedBusinessHours = workerSections
      .filter((hour) => hour.start_h && hour.end_h && hour.working_day)
      .map((hour) => ({
        daysOfWeek: [dayMapping[hour.working_day.toLowerCase()] || 0],
        startTime: formatTime(hour.start_h),
        endTime: formatTime(hour.end_h),
      }));
    setBusinessHours(updatedBusinessHours);
  }, [workerSections]);

  const handleMouseEnter = (info, event) => {
    const { clientX, clientY } = event;
    const timeout = setTimeout(() => {
      setTooltipEvent(info.event);
      setTooltipPosition({ x: clientX, y: clientY });
    }, 500);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setTooltipEvent(null);
  };

  const handleNewEventPopup = (info) => {
    setDateSelected(info.dateStr);
    setDisplayAddEventPopup(true);
  };

  return (
    <div className={`w-full h-full rounded-lg p-4 overflow-auto flex flex-col ${className}`}>
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className="px-4 py-2 bg-gray-500 text-white rounded">
            Filtres
          </button>
          {isFilterMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-10">
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Type de rendez-vous"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Client"
                  onChange={(e) => handleFilterChange('client', e.target.value)}
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Animal"
                  onChange={(e) => handleFilterChange('animal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {tooltipEvent && (
        <div
          className="absolute w-48 h-auto z-50 p-2 bg-white rounded shadow-lg border text-sm break-words"
          style={{
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            transform: 'translate(10px, -50%)',
            pointerEvents: 'none',
          }}
        >
          <p className="text-gray-600 break-words">{tooltipEvent.extendedProps.description || 'Pas de description'}</p>
        </div>
      )}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={view}
        locale={frLocale}
        timeZone="Europe/Paris"
        nowIndicator
        slotLabelInterval="01:00:00"
        slotDuration="00:30:00"
        slotMinTime="09:00"
        slotMaxTime="18:00"
        allDaySlot={false}
        height="auto"
        hiddenDays={[0, 6]}
        editable={false}
        events={filteredEvents}
        eventOverlap
        slotEventOverlap={false}
        displayEventTime
        eventMaxStack={2}
        businessHours={businessHours}
        titleFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
        dateClick={(info) => handleNewEventPopup(info)}
        datesSet={(info) => datesSet({ startStr: info.startStr, endStr: info.endStr })}
        headerToolbar={{ start: 'prev,next today', center: 'title', end: 'seeAllBusiness,timeGridWeek,dayGridMonth' }}
        customButtons={{
          seeAllBusiness: {
            text: 'Voir les disponibilités',
            click: () => setDisplayWorkerSectionPopup(true),
          },
        }}
        eventMouseEnter={(info) => handleMouseEnter(info, window.event)}
        eventMouseLeave={handleMouseLeave}
        eventDidMount={(info) => {
          info.el.addEventListener('contextmenu', (e) => handleEventRightClick(info, e));
          if (deletingEventId === info.event.id) {
            info.el.classList.add('opacity-50', 'pointer-events-none');
          } else {
            info.el.classList.remove('opacity-50', 'pointer-events-none');
          }
        }}
        eventContent={(arg) => {
          console.log(arg.event.extendedProps.id_client);
          const { animalName, clientName, description } = arg.event.extendedProps;
          let eventClass = 'eventContainer event-default';
          if (arg.event.extendedProps.state === 'Vue') {
            eventClass = 'eventContainer event-seen';
          } else if (arg.event.extendedProps.state === 'Absence excusée') {
            eventClass = 'eventContainer event-excused-absence event-seen';
          } else if (arg.event.extendedProps.state === 'Absence non excusée') {
            eventClass = 'eventContainer event-unexcused-absence event-seen';
          }

          return (
            <div
              className={`pl-2 ${eventClass} bg-main-color cursor-pointer`}
              onClick={() => navigate(`/client/${arg.event.extendedProps.id_client}`)}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{arg.timeText.split(' ')[0]} </span>
                {clientName} pour {animalName}
              </div>
              <div className="mt-1 text-sm">
                <p className="">{description}</p>
              </div>
            </div>
          );
        }}
      />

      {contextMenuPosition && contextEvent && (
        <div
          className="absolute z-50 w-48 bg-white rounded shadow-lg border"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          onMouseLeave={() => setContextMenuPosition(null)}
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              console.log('Modifier le RDV :', contextEvent.id);
              setContextMenuPosition(null);
            }}
          >
            Modifier
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
            onClick={async () => {
              try {
                setDeletingEventId(contextEvent.id);
                await deleteEventById(contextEvent.id);
                setContextMenuPosition(null);
                await fetchEventByVeterinarian();
                setDeletingEventId(null);
              } catch (err) {
                console.error('Erreur suppression:', err);
                setDeletingEventId(null);
              }
            }}
          >
            Supprimer
          </button>
        </div>
      )}

      {displayWorkerSectionPopup && (
        <DisplayWorkerSectionPopup
          onClose={() => {
            setDisplayWorkerSectionPopup(false);
            removeBlackBackground();
          }}
          workerSections={workerSections}
          fetchWorkerSectionByVeterinarian={fetchWorkerSectionByVeterinarian}
          addWorkerSection={addWorkerSection}
          updateWorkerSectionById={updateWorkerSectionById}
          destroyWorkerSectionById={destroyWorkerSectionById}
        />
      )}

      {displayAddEventPopup && (
        <AddEventPopup
          onClose={() => {
            removeBlackBackground();
            setDisplayAddEventPopup(false);
          }}
          dateSelected={dateSelected}
          setDateSelected={setDateSelected}
          addEvent={addEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
