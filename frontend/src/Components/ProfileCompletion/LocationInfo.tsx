import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Country, State, City } from "country-state-city";
import type { PersonalInfoType } from "../../Types/UserTypes";

interface LocationInfoProps {
  personalInfo: PersonalInfoType;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfoType>>;
  countryRef: React.RefObject<HTMLSelectElement>;
  stateRef: React.RefObject<HTMLSelectElement>;
  cityRef: React.RefObject<HTMLSelectElement>;
  postalRef: React.RefObject<HTMLInputElement>;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  personalInfo,
  setPersonalInfo,
  countryRef,
  stateRef,
  cityRef,
  postalRef,
}) => {
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Location</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <select
          ref={countryRef}
          value={countryCode}
          onChange={(e) => {
            setCountryCode(e.target.value);
            setPersonalInfo({
              ...personalInfo,
              Location: [
                {
                  ...personalInfo.Location[0],
                  country: Country.getCountryByCode(e.target.value)?.name || "",
                },
              ],
            });
          }}
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="" className="bg-pink-500">
            Select Country
          </option>
          {Country.getAllCountries().map((country) => (
            <option
              className="bg-pink-500"
              key={country.isoCode}
              value={country.isoCode}
            >
              {country.name}
            </option>
          ))}
        </select>
        <select
          ref={stateRef}
          value={stateCode}
          onChange={(e) => {
            setStateCode(e.target.value);
            setPersonalInfo({
              ...personalInfo,
              Location: [
                {
                  ...personalInfo.Location[0],
                  State:
                    State.getStateByCodeAndCountry(e.target.value, countryCode)
                      ?.name || "",
                },
              ],
            });
          }}
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="" className="bg-pink-500">
            Select State
          </option>
          {State.getStatesOfCountry(countryCode).map((state) => (
            <option
              className="bg-pink-500"
              key={state.isoCode}
              value={state.isoCode}
            >
              {state.name}
            </option>
          ))}
        </select>
        <select
          ref={cityRef}
          value={personalInfo.Location[0].city}
          onChange={(e) =>
            setPersonalInfo({
              ...personalInfo,
              Location: [{ ...personalInfo.Location[0], city: e.target.value }],
            })
          }
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="" className="bg-pink-500">
            Select City
          </option>
          {City.getCitiesOfState(countryCode, stateCode).map((city) => (
            <option className="bg-pink-500" key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <input
          ref={postalRef}
          type="text"
          placeholder="Postal Code"
          value={personalInfo.pincode}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, pincode: e.target.value })
          }
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
    </motion.section>
  );
};

export default LocationInfo;
