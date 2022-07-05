import { ChangeEvent, isValidElement, ReactEventHandler, useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Spacing, ImageView } from 'pds-dev-kit-web';
import * as PDS from 'pds-dev-kit-web';
import ErrorBoundary from './ErrorBoundary';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Papa from 'papaparse';

const defaultComponent = {
  pdsName: 'ImageView',
  props: {
    shapeType: 'circular',
    ratio: '1_1',
    scaleType: 'cover',
    src: 'https://akns-images.eonline.com/eol_images/Entire_Site/2016913/rs_600x600-161013070911-600.bart-simpson.ch.101316.jpg?fit=around%7C660:372&output-quality=90&crop=660:372;center,top',
    width: 'responsive',
  },
};

function converter() {
  const [prefix, setPrefix] = useState('D_');
  const [result, setResult] = useState('');
  const [csvData, setCsvData] = useState<any>(null);

  const [component, setComponent] = useState<{ pdsName: string; props: any }>(defaultComponent);

  useEffect(() => {
    if (csvData) {
      console.log(csvData);
      Papa.parse(csvData, {
        header: true,
        download: true,
        complete: (data) => {
          console.log(data);
        },
      });
    }
  }, [csvData]);

  function parser(value: string) {
    const splitted = value.split('\n');
    const propsArray = splitted.filter((each: string) => each.includes(':'));
    const pdsName = splitted[0];

    const props = propsArray.reduce((prev: any, curr: any) => {
      const split = curr.split(':');
      const key = split[0].trim();
      const value = split[1].trim();

      return { ...prev, [key]: value };
    }, {});

    const convertedProps = Object.entries(props).reduce((prev: any, curr: any) => {
      const [propKey, propValue] = curr;

      if (!isNaN(propValue)) {
        return prev + '\n' + ' ' + `${propKey}={${propValue}}`;
      }

      return prev + '\n' + ' ' + `${propKey}='${propValue}'`;
    }, '');

    const hasPrefix = Object.keys(PDS).includes(prefix + pdsName);

    if (hasPrefix) {
      setComponent({ pdsName: `${prefix}${pdsName}`, props });
      return `<${prefix}${pdsName} ${convertedProps} \n/>`;
    }

    setComponent({ pdsName, props });
    return `<${pdsName} ${convertedProps} \n/>`;
  }

  function onChangeCopyArea(e: ChangeEvent<HTMLTextAreaElement>) {
    try {
      const parsedResult = parser(e.target.value);
      setResult(parsedResult);
    } catch (e) {
      console.error(e);
    }
  }

  const Component = PDS[component.pdsName];

  function handleChangeSelect(e: ChangeEvent<HTMLSelectElement>) {
    setPrefix(e.target.value);
  }

  function handleChangeCSV(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setCsvData(e.target.files[0]);
    }
  }

  return (
    <S_Converter>
      <div>
        환경:
        <select defaultValue="D_" onChange={handleChangeSelect}>
          <option id="D" value="D_">
            DESKTOP
          </option>
          <option id="M" value="M_">
            MOBILE
          </option>
          <option id="NONE" value="NONE">
            NONE
          </option>
        </select>
      </div>
      <div>
        String-key:
        <input type="file" onChange={handleChangeCSV} />
      </div>
      <S_Main>
        <S_CopyArea placeholder="이곳에 붙여넣으세요." onChange={onChangeCopyArea} />
        <S_resultArea>
          <pre>{result}</pre>
        </S_resultArea>
      </S_Main>

      <Viewer>
        <ErrorBoundary
          fallbackView={<div>에러가 났어요! 컴포넌트를 수정하고 다시 시도해주세요!</div>}
          resetKeys={[component]}
        >
          <div>
            <div>여기는 라이트톤!</div>
            <ThemeProvider theme={PDS.customTheme('LIGHT')}>
              <S_Viewer>
                <Component {...component.props} />
              </S_Viewer>
            </ThemeProvider>
          </div>

          <div>
            <div>여기는 다크톤!</div>
            <ThemeProvider theme={PDS.customTheme('DARK')}>
              <S_Viewer>
                <Component {...component.props} />
              </S_Viewer>
            </ThemeProvider>
          </div>
        </ErrorBoundary>
      </Viewer>
    </S_Converter>
  );
}

const Viewer = styled.div`
  display: flex;
  flex-direction: row;
`;

const S_Main = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 300px;
`;

const S_Viewer = styled.div`
  background-color: ${({ theme }) => theme.ui_temp_background};
  min-width: 300px;
  min-height: 300px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const S_resultArea = styled.div`
  min-width: 200px;
  height: 50%;
  border: 1px solid black;
`;

const S_CopyArea = styled.textarea`
  width: 50%;
  height: 50%;
`;

const S_Converter = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default converter;
