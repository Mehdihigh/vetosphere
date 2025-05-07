import AddressAutocomplete from "./autocomplete/addressAutocomplete";
import Input from "./Input";
import React, {useEffect, useState} from "react";

const Address = ({addressDetails, setAddressDetails, wraped}) => {
    const [complement,setComplement] = useState("");
    const [styleContainer, setStyleContainer] = useState(null);
    const [styleRow, setStyleRow] = useState(null);

    useEffect(() => {
        if (wraped) {
            setStyleContainer("flex flex-col space-y-4");
            setStyleRow("flex flex-col lg:flex-row lg:justify-between space-x-4")
        } else {
            setStyleContainer("");
            setStyleRow("flex flex-col lg:flex-row lg:justify-between")
        }
    }, [wraped]);

    return (
        <div className={styleContainer}>
            <div className={styleRow}>

                <AddressAutocomplete
                    className={"default"}
                    onSuggestionSelected={() => {}}
                    setAddressDetails={setAddressDetails}
                    defaultAddress={addressDetails.address}
                />

                <Input
                    type={"text"}
                    placeholder={"Code Postal"}
                    isRequired={false}
                    className={"default"}
                    value={addressDetails.postalCode}
                    onChange={(event) => setAddressDetails({ ...addressDetails, postalCode: event.target.value })}
                    disabled={false}
                />

            </div>

            <div className={styleRow}>
                <Input
                    type={"text"}
                    placeholder={"Ville"}
                    isRequired={false}
                    className={"default"}
                    value={addressDetails.city}
                    onChange={(event) => setAddressDetails({ ...addressDetails, city: event.target.value })}
                    disabled={false}
                />

                <Input
                    type="text"
                    placeholder="Complément"
                    className="default"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                />
            </div>


        </div>
    );
}

export default Address;