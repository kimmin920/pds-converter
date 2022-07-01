import { customTheme } from "pds-dev-kit-web";
import styled, { ThemeProvider } from "styled-components";
import PDSconverter from "../components/PDSconverter";
import theme from "./theme";


function App() {
  console.log('App');

  return (
    <ThemeProvider theme={theme}>
      <S_App>
        <PDSconverter />
      </S_App>
    </ThemeProvider>
  );
}

const S_App = styled.div`
  height: 100%;
  width: 100%;
`;

export default App;
