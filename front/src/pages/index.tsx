import Link from "next/link";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

export default function Home() {
  return (
    <>
      <MainContainer>
        <h1>Buenas ¿Que eres?</h1>
        <Link href="/medico/">Soy medico</Link>
        <br />
        <Link href="/paciente/">Soy paciente</Link>
      </MainContainer>
    </>
  );
}
