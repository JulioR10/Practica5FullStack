import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import styled from "styled-components";

// Todas las mutaciones se hacen en el lado del cliente
// Realizar estas operaciones en el lado del cliente reduce la cantidad de datos que deben
// enviarse a través de la red. En lugar de enviar todo el estado de la aplicación
// al servidor y luego recibir una respuesta completa, sólo los detalles necesarios de la
// operación se envían al servidor, y sólo los resultados de esa operación se envían
// de vuelta al cliente.
// Al realizar estas operaciones en el cliente, puedes actualizar inmediatamente la interfaz
// de usuario como si la operación hubiera tenido éxito, antes de que la respuesta
// del servidor esté disponible. Tambien ayuda a reducir la carga del servidor.

const ADD_SLOT = gql`
  mutation AddSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!) {
    addSlot(year: $year, month: $month, day: $day, hour: $hour) {
      year
      month
      day
      hour
      available
      dni
    }
  }
`;

const REMOVE_SLOT = gql`
  mutation RemoveSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!) {
    removeSlot(year: $year, month: $month, day: $day, hour: $hour) {
      day
      month
      year
      hour
    }
  }
`;

const Index: React.FC = () => {
  const [yearInput, setYear] = useState<number>(0);
  const [monthInput, setMonth] = useState<number>(0);
  const [dayInput, setDay] = useState<number>(0);
  const [hourInput, setHour] = useState<number>(0);

  const [addSlot, { data: addedSlot }] = useMutation(ADD_SLOT);

  const handleAddSlot = async () => {
    if (yearInput && monthInput && dayInput && hourInput) {
      try {
        await addSlot({
          variables: {
            year: yearInput,
            month: monthInput,
            day: dayInput,
            hour: hourInput,
          },
        });
        alert("Slot added successfully");
      } catch (error) {
        alert("An error occurred while adding the slot");
        console.error(error);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const [yearDel, setYearDel] = useState<number>(0);
  const [monthDel, setMonthDel] = useState<number>(0);
  const [dayDel, setDayDel] = useState<number>(0);
  const [hourDel, setHourDel] = useState<number>(0);

  const [removeSlot, { data: removedSlot }] = useMutation(REMOVE_SLOT);

  const handleRemoveSlot = async () => {
    await removeSlot({
      variables: {
        year: yearInput,
        month: monthInput,
        day: dayInput,
        hour: hourInput,
      },
    });
  };

  return (
    <>
      <MainContainer>
        <h1>Añadir Slot</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSlot();
          }}
        >
          <label>
            Año:
            <input
              type="number"
              name="year"
              value={yearInput || ""}
              onChange={(e) => {
                setYear(parseInt(e.target.value));
              }}
            />
          </label>
          <label>
            Mes:
            <input
              type="number"
              name="month"
              value={monthInput || ""}
              onChange={(e) => {
                setMonth(parseInt(e.target.value));
              }}
            />
          </label>
          <label>
            Dia:
            <input
              type="number"
              name="day"
              value={dayInput || ""}
              onChange={(e) => {
                setDay(parseInt(e.target.value));
              }}
            />
          </label>
          <label>
            Hora:
            <input
              type="number"
              name="hour"
              value={hourInput || ""}
              onChange={(e) => {
                setHour(parseInt(e.target.value));
              }}
            />
          </label>
          <button type="submit">Añadir Slot</button>
        </form>
        {addedSlot && (
          <div>
            <h2>Slot Añadido</h2>
            <p>Año: {addedSlot.addSlot.year}</p>
            <p>Mes: {addedSlot.addSlot.month}</p>
            <p>Día: {addedSlot.addSlot.day}</p>
            <p>Hora: {addedSlot.addSlot.hour}</p>
          </div>
        )}

        <h1>Eliminar Slot</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRemoveSlot();
          }}
        >
          <label>
            Año:
            <input
              type="number"
              name="year"
              value={yearDel || ""}
              onChange={(e) => {
                setYearDel(parseInt(e.target.value));
              }}
            />
          </label>
          <label>
            Mes:
            <input
              type="number"
              name="month"
              value={monthDel || ""}
              onChange={(e) => {
                setMonthDel(parseInt(e.target.value));
              }}
            />
          </label>
          <label>
            Dia:
            <input
              type="number"
              name="day"
              value={dayDel || ""}
              onChange={(e) => {
                setDayDel(parseInt(e.target.value));
              }}
            />
          </label>
          <label>
            Hora:
            <input
              type="number"
              name="hour"
              value={hourDel || ""}
              onChange={(e) => {
                setHourDel(parseInt(e.target.value));
              }}
            />
          </label>
          <button type="submit">Eliminar Slot</button>
        </form>
        {removedSlot && (
          <div>
            <h2>Slot Eliminado</h2>
            <p>Año: {removedSlot.removeSlot.year}</p>
            <p>Mes: {removedSlot.removeSlot.month}</p>
            <p>Día: {removedSlot.removeSlot.day}</p>
            <p>Hora: {removedSlot.removeSlot.hour}</p>
          </div>
        )}
      </MainContainer>
    </>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

export default Index;
