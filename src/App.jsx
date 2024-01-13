import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const SELECTED_PLACES = "selectedPlaces";

const storedIds = JSON.parse(localStorage.getItem(SELECTED_PLACES)) || [];
const storedPlaces = storedIds.map((id) => {
  return AVAILABLE_PLACES.find((item) => item.id === id);
});

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [open, setOpen] = useState(false);

  function handleStartRemovePlace(id) {
    setOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storedIds = JSON.parse(localStorage.getItem(SELECTED_PLACES)) || [];
    localStorage.setItem(SELECTED_PLACES, JSON.stringify([...storedIds, id]));
  }

  const handleRemovePlace = useCallback(() => {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setOpen(false);

    const storedIds = JSON.parse(localStorage.getItem(SELECTED_PLACES)) || [];
    localStorage.setItem(
      SELECTED_PLACES,
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        coords.latitude,
        coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  return (
    <>
      <Modal open={open} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={"Sorting places by the distance..."}
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
