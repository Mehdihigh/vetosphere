import dayjs from 'dayjs';
import React, { useState } from 'react';
import SearchClientAutocomplete from '../../../components/common/autocomplete/searchClientAutocomplete.tsx';
import Button from '../../../components/common/button/Button.tsx';
import Input from '../../../components/common/form/Input.tsx';
import Textarea from '../../../components/common/form/textarea.tsx';
import Select from '../../../components/common/select/Select.tsx';
import PopupDisplay from '../../../components/popup/PopupDisplay.tsx';
import { useAnimal } from '../../../hooks/animal/useAnimal.ts';
import { durationList, startHourList, startMinuteList } from '../../../utils/constant.ts';
import { extractTime, splitDate } from '../../../utils/dateManager.ts';

interface AddEventPopupProps {
  onClose: () => void;
  dateSelected: string;
  setDateSelected: (date: string) => void;
  addEvent: (data: {}) => void;
}

const AddEventPopup: React.FC<AddEventPopupProps> = ({ onClose, dateSelected, setDateSelected, addEvent }) => {
  const [description, setDescription] = useState<string>('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [startHour, setStartHour] = useState<string>(() => extractTime(dateSelected, 'hour'));
  const [startMinute, setStartMinute] = useState<string>(() => extractTime(dateSelected, 'minute'));
  const [animalSelected, setAnimalSelected] = useState(1);
  const { animalList, fetchAnimalByIdClient } = useAnimal(null);
  const [duration, setDuration] = useState('60');

  const handlePostEventClick = async () => {
    const formattedStart = dayjs(`${splitDate(dateSelected)} ${startHour}:${startMinute.toString().padStart(2, '0')}:00`);

    const durationInMinutes = parseInt(duration, 10);

    const endDateTime = formattedStart.add(durationInMinutes, 'minute');

    const formattedStartDate = formattedStart.add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const formattedEnd = endDateTime.add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    const eventData = {
      start_date: formattedStartDate,
      end_date: formattedEnd,
      description,
      status: 'Attente',
      id_animal: animalSelected,
      id_event_type: 1,
    };

    try {
      console.log('📅 Données envoyées :', eventData);
      await addEvent(eventData);
      onClose();
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'événement :", error);
    }
  };

  const handleSuggestionSelected = (event, { suggestion }) => {
    fetchAnimalByIdClient(suggestion.value);
  };

  return (
    <PopupDisplay onClose={onClose} size="w-1/3 h-auto" flex="flex flex-col p-6 space-y-4 bg-white rounded-xl shadow-lg">
      <Input
        type="date"
        value={splitDate(dateSelected)}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
        isRequired={true}
        onChange={(event) => setDateSelected(event.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <Select
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(event) => setStartHour(event.target.value)}
          listOptions={startHourList}
          valueKey="value"
          labelKey="label"
          value={startHour}
        />
        <Select
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(event) => setStartMinute(event.target.value)}
          listOptions={startMinuteList}
          valueKey="value"
          labelKey="label"
          value={startMinute}
        />
      </div>

      <Select
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
        listOptions={durationList}
        onChange={(event) => setDuration(event.target.value)}
        valueKey="value"
        labelKey="label"
        value={duration}
      />

      <SearchClientAutocomplete onSuggestionSelected={handleSuggestionSelected} className="w-full" />

      <Select
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
        listOptions={animalList}
        onChange={(event) => setAnimalSelected(event.target.value)}
        value={animalSelected}
        valueKey={'id'}
        labelKey={'name'}
      />

      <Textarea
        className="w-full h-20 p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        value={description}
      />

      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePostEventClick}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition"
          type="submit"
          content="Ajouter le rdv"
        />
        <Button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 transition"
          type="button"
          content="Fermer"
        />
      </div>
    </PopupDisplay>
  );
};

export default AddEventPopup;
