import { ChangeEvent, isValidElement, ReactEventHandler, useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Spacing, ImageView } from 'pds-dev-kit-web';
import * as PDS from 'pds-dev-kit-web';
import ErrorBoundary from './ErrorBoundary';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Papa from 'papaparse';
import { convertComponentData } from './helpers';

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
  const [result, setResult] = useState([]);
  const [csvData, setCsvData] = useState<any>(null);
  const [stringKeyPair, setStringKeyPair] = useState<any>({});
  const [showPreview, setShowPreview] = useState(false);

  function toggleShowPreview() {
    setShowPreview((prev) => !prev);
  }

  useEffect(() => {
    if (csvData) {
      Papa.parse(csvData, {
        header: true,
        download: true,
        complete: (data) => {
          setStringKeyPair(
            data.data.reduce((acc: Record<string, string>, cur: Record<any, unknown>) => {
              const parsedValue = cur['KR'].replaceAll('"', '').slice(0, -1);

              const split = parsedValue.split(':');

              const parsedKey = split[0].trim();
              const parsedValuee = split[1].trim();

              return {
                ...acc,
                [parsedKey]: `t('${parsedKey}', '${parsedValuee}')`,
              };
            }, {})
          );
        },
      });
    }
  }, [csvData]);

  function parser(value: string) {
    const splitted = value.split('\n');
    const structuredByComponent = splitted.reduce((acc: any, cur: any) => {
      if (cur === '') {
        return acc;
      }

      if (cur.includes(':')) {
        const lastObj = acc[acc.length - 1];

        const split = cur.split(':');
        const key = split[0].trim();
        const value = split[1].trim();

        const newProps = { ...lastObj.props, [key]: value };

        acc.splice(acc.length - 1, 1, { pdsName: lastObj.pdsName, props: newProps });

        return acc;
      }

      //NOTE: its component name

      return acc.concat({ pdsName: cur, props: {} });
    }, []);

    return structuredByComponent.map((each: any) =>
      convertComponentData(prefix, each, stringKeyPair)
    );
  }

  function onChangeCopyArea(e: ChangeEvent<HTMLTextAreaElement>) {
    try {
      const parsedResult = parser(e.target.value);
      console.log(parsedResult);
      setResult(parsedResult);
    } catch (e) {
      console.error(e);
    }
  }

  function handleChangeSelect(e: ChangeEvent<HTMLSelectElement>) {
    setPrefix(e.target.value);
  }

  function handleChangeCSV(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setCsvData(e.target.files[0]);
    }
  }

  async function onClickCopy() {
    const codes = document.getElementById('display-code')?.innerText;

    if (codes) {
      try {
        await navigator.clipboard.writeText(codes);
        alert('Oh, copied, you only do copy-and-paste salary roopang!');
      } catch (error) {
        alert('sorry, copy failed. do it your self ^__^');
      }
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
        <button type="button" onClick={onClickCopy}>
          COPY ALL!
        </button>
        <S_resultArea id="display-code">
          {result.map((each: any) => {
            return <pre>{each.displayCode}</pre>;
          })}
        </S_resultArea>
      </S_Main>

      <button type="button" onClick={toggleShowPreview}>
        미리보기 내놔
      </button>
      {showPreview && (
        <Viewer>
          <ErrorBoundary
            fallbackView={<div>에러가 났어요! 컴포넌트를 수정하고 다시 시도해주세요!</div>}
            resetKeys={[result]}
          >
            {result.map((each: any) => {
              if (PDS[each.pdsName]) {
                const Component = PDS[each.pdsName];

                return (
                  <S_EachComponentView>
                    <ErrorBoundary
                      fallbackView={
                        <div>에러가 났어요! 컴포넌트를 수정하고 다시 시도해주세요!</div>
                      }
                      resetKeys={[result]}
                    >
                      <div>여기는 라이트톤!</div>
                      <ThemeProvider theme={PDS.customTheme('LIGHT')}>
                        <S_Viewer>
                          <Component {...each.props} />
                        </S_Viewer>
                      </ThemeProvider>

                      <ThemeProvider theme={PDS.customTheme('DARK')}>
                        <S_Viewer>
                          <Component {...each.props} />
                        </S_Viewer>
                      </ThemeProvider>
                    </ErrorBoundary>
                  </S_EachComponentView>
                );
              }

              return (
                <S_EachComponentView>this component is error: {each.pdsName}</S_EachComponentView>
              );
            })}
          </ErrorBoundary>
        </Viewer>
      )}
    </S_Converter>
  );
}

const S_EachComponentView = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Viewer = styled.div`
  display: flex;
  flex-direction: column;
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
  overflow-y: scroll;
  border: 1px solid black;
  color: #f1eaea;
  background-color: #363030;
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
