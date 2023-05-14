import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import styled from "styled-components";

// Get_Slots podría hacerse con Server Side Rendering (SSR) para asegurar que los datos
// están actualizados en cada solicitud.
// Esto resultaria en una carga inicial más rápida de la página y una mejor optimización
// para los motores de búsqueda. Sin embargo, puede aumentar la carga en el servidor y
// no refleja los cambios en tiempo real.
// Dado que las reservas van a sufrir cambios constantes en este caso se ha optado
// por hacerlo con Client Side Rendering (CSR) todo.

const GET_SLOTS = gql`
  query Query($year: Int!, $month: Int!) {
    availableSlots(year: $year, month: $month) {
      year
      month
      day
      hour
      available
      dni
    }
  }
`;

const UPDATE_SLOT = gql`
  mutation Mutation(
    $year: Int!
    $month: Int!
    $day: Int!
    $hour: Int!
    $dni: String!
  ) {
    bookSlot(year: $year, month: $month, day: $day, hour: $hour, dni: $dni) {
      day
      month
      year
      hour
      available
      dni
    }
  }
`;

const Index: React.FC = () => {
  const [yearInput, setYear] = useState<number>(0);
  const [monthInput, setMonth] = useState<number>(0);

  const { data, refetch } = useQuery(GET_SLOTS, {
    variables: { year: yearInput, month: monthInput },
    skip: !yearInput || !monthInput,
  });

  useEffect(() => {
    if (yearInput && monthInput) {
      refetch();
    }
  }, [refetch]);

  const citas = data?.availableSlots || [];

  const [yearUpd, setYearUpd] = useState<number>(0);
  const [monthUpd, setMonthUpd] = useState<number>(0);
  const [dayUpd, setDayUpd] = useState<number>(0);
  const [hourUpd, setHourUpd] = useState<number>(0);
  const [dniInput, setDni] = useState<string>("");

  const [updateSlot, { data: updatedSlot }] = useMutation(UPDATE_SLOT);

  const handleUpdateSlot = async () => {
    if (yearUpd && monthUpd && dayUpd && hourUpd && dniInput) {
      try {
        await updateSlot({
          variables: {
            year: yearUpd,
            month: monthUpd,
            day: dayUpd,
            hour: hourUpd,
            dni: dniInput,
          },
          // refetchQueries: [
          //   {
          //     query: GET_SLOTS,
          //     variables: { year: yearInput, month: monthInput },
          //   },
          // ],
        });
        alert("Slot updated successfully");
      } catch (error) {
        alert("An error occurred while updating the slot");
        console.error(error);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <>
      <Title>Estos son los slots</Title>
      <GridContainer>
        {citas.map((cita: any) => (
          <StyledDiv key={cita.year + cita.month + cita.day + cita.hour}>
            <Paragraph>
              {cita.year}/{cita.month}/{cita.day} a las {cita.hour}hs
            </Paragraph>
            <Paragraph>Disponible: {cita.available ? "Si" : "No"}</Paragraph>
            <Paragraph>DNI: {cita.dni ? cita.dni : "No introducido"}</Paragraph>
            <Paragraph>---------------------------</Paragraph>
          </StyledDiv>
        ))}
      </GridContainer>
      <Input
        type="number"
        placeholder="Año"
        onChange={(e) => setYear(parseInt(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Mes"
        onChange={(e) => setMonth(parseInt(e.target.value))}
      />

      <Title>Actualiza un slot</Title>
      <Input
        type="number"
        placeholder="Año"
        onChange={(e) => setYearUpd(parseInt(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Mes"
        onChange={(e) => setMonthUpd(parseInt(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Dia"
        onChange={(e) => setDayUpd(parseInt(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Hora"
        onChange={(e) => setHourUpd(parseInt(e.target.value))}
      />
      <Input
        type="text"
        placeholder="DNI"
        onChange={(e) => setDni(e.target.value)}
      />
      <Button onClick={handleUpdateSlot}>Actualizar</Button>
      {updatedSlot && (
        <Paragraph>
          {updatedSlot.bookSlot.year}/{updatedSlot.bookSlot.month}/
          {updatedSlot.bookSlot.day} a las {updatedSlot.bookSlot.hour}hs
        </Paragraph>
      )}
    </>
  );
};

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  margin: 10px;
`;

const Button = styled.button`
  margin: 10px;
`;

const Paragraph = styled.p`
  text-align: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const StyledDiv = styled.div`
  border: 1px solid black;
  margin: 10px;
  padding: 10px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export default Index;

// Aqui como seria el getServerSideProps para que funcione con Apollo

// import { initializeApollo } from "../path-to-your-apolloClient-file";
// import { gql } from "@apollo/client";

// const GET_SLOTS = gql`
//   query Query($year: Int!, $month: Int!) {
//     availableSlots(year: $year, month: $month) {
//       year
//       month
//       day
//       hour
//       available
//       dni
//     }
//   }
// `;

// export async function getServerSideProps() {
//   const apolloClient = initializeApollo();

//   const { data } = await apolloClient.query({
//     query: GET_SLOTS,
//     variables: { year: 2023, month: 5 }, // reemplaza con las variables que necesites
//   });

//   return {
//     props: {
//       slots: data.availableSlots,
//     },
//   };
// }

// const Index = ({ slots }) => {
//   // Ahora los slots están disponibles como prop y puedes utilizarlos en tu componente
//   // ...
// };

// export default Index;

// Aqui como seria el getStaticProps para que funcione con Apollo

// import { initializeApollo } from "../path-to-your-apolloClient-file";
// import { gql } from "@apollo/client";

// const GET_SLOTS = gql`
//   query Query($year: Int!, $month: Int!) {
//     availableSlots(year: $year, month: $month) {
//       year
//       month
//       day
//       hour
//       available
//       dni
//     }
//   }
// `;

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   const { data } = await apolloClient.query({
//     query: GET_SLOTS,
//     variables: { year: 2023, month: 5 }, // reemplaza con las variables que necesites
//   });

//   return {
//     props: {
//       slots: data.availableSlots,
//     },
//     revalidate: 1, // Esto hará que la página se regenere cada segundo si hay nuevas peticiones
//   };
// }

// const Index = ({ slots }) => {
//   // Ahora los slots están disponibles como prop y puedes utilizarlos en tu componente
//   // ...
// };

// export default Index;
