// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const fs = require('fs');

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// import { GoogleSpreadsheet } from 'google-spreadsheet';

// const SPREADSHEET_API_KEY = 'AIzaSyC73Lp5v7FjjEgD2jgysEfAVig1Iz3cQ50';
// const SPREADSHEET_DOCUMENT_KEY = '1sdLVn7f2shaT4Lzno-mBpF3kgNOqUUAfNIzaFqLKBe0';
// const SPREADSHEET_SHEET_KEY = 1957977114;

// const apiKey = SPREADSHEET_API_KEY; // 구글 스프레드 시트 사용 API 키
// const documentKey = SPREADSHEET_DOCUMENT_KEY; // 구글 스프레드 시트 문서 키
// const sheetKey = SPREADSHEET_SHEET_KEY; // 구글 스프레드 시트 키

// /** 다국어 시트에서 가져온 값들이 저장될 위치 */
// const localeDir = './src/common/services/i18n/resources';

// /**
//  * 구글 스프레드시트를 로딩한다.
//  */
// export default async function loadDocument() {
//   const doc = new GoogleSpreadsheet(documentKey);

//   await doc.useApiKey(apiKey);
//   await doc.loadInfo();

//   return doc;
// }

// /**
//  * 스프레드시트의 헤더로부터 다국어 코드 정보를 추출한다. 괄호()안에 있다고 추정함.
//  *
//  * @param {string} t
//  */
// function getLocaleString(t) {
//   const r = t.match(/([a-zA-Z-]+)/);

//   if (r) {
//     const locale = r[1].toLowerCase();

//     switch (locale) {
//       case 'kr':
//         return 'ko';
//       case 'zh-cn':
//         return 'zh';
//       default:
//         return locale;
//     }
//   }

//   return null;
// }

// /**
//  * 구글 스프레드시트로부터 웹 번역 데이터 시트를 가져와서 각 언어별로 locale 디렉토리에 JSON 파일로 저장한다.
//  */
// async function loadData(doc) {
//   const sheet = await doc.sheetsById[sheetKey];
//   const rows = await sheet.getRows();
//   const locales = [];

//   await sheet.loadHeaderRow();

//   for (const header of sheet.headerValues) {
//     const locale = getLocaleString(header)?.replace('zh-', '');

//     if (locale) {
//       const jsonLines = [];

//       for (const row of rows) {
//         const cell = row[header];

//         if (cell && cell.indexOf('#REF') < 0) {
//           const nestedChecked = cell;
//           jsonLines.push(nestedChecked);
//         }
//       }

//       if (jsonLines.length > 0) {
//         try {
//           const lastLine = jsonLines.pop();
//           jsonLines.push(lastLine.slice(0, -1));
//           const rawJson = `{${jsonLines.join('')}}`;
//           const parsedJson = JSON.parse(rawJson);
//           fs.writeFileSync(
//             `${localeDir}/${locale}.json`,
//             `${JSON.stringify({ translation: parsedJson }, null, 2)}\n`
//           );
//           locales.push(locale);
//         } catch (e) {
//           jsonLines.forEach((item) => {
//             const rawraw = `{${item.slice(0, -1)}}`;
//             JSON.parse(rawraw);
//           });
//         }
//       }
//     }
//   }

//   // index.js 파일 생성
//   const disableLint = '/* eslint-disable import/order */';
//   const importList = locales
//     .map((locale, idx) => `import locale${idx + 1} from './${locale}.json';`)
//     .join('\n');
//   const exportList = locales.map((locale, idx) => `  ${locale}: locale${idx + 1}`).join(',\n');
//   const indexContent = `${disableLint}\n${importList}\n\nconst locale = {\n${exportList}\n} as const;\n\nexport default locale;\n`;

//   fs.writeFileSync(`${localeDir}/index.ts`, indexContent);
// }

// loadDocument().then(loadData);
