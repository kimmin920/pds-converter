import * as PDS from 'pds-dev-kit-web';

export function convertProps(props: Record<string, string>, stringKeyPair: any) {
  const convertedProps = Object.entries(props).reduce((prev: any, curr: any) => {
    const [propKey, propValue] = curr;

    if (!isNaN(propValue)) {
      return prev + '\n' + ' ' + `${propKey}={${propValue}}`;
    }

    if (typeof propValue === 'string') {
      if (propValue.startsWith('str') && stringKeyPair[propValue]) {
        return prev + '\n' + ' ' + `${propKey}={${stringKeyPair[propValue]}}`;
      }
    }

    return prev + '\n' + ' ' + `${propKey}='${propValue}'`;
  }, '');

  return convertedProps;
}

export function convertComponentName(prefix: string, pdsName: string) {
  const hasPrefix = Object.keys(PDS).includes(prefix + pdsName);

  if (hasPrefix) {
    return `${prefix}${pdsName}`;
  }

  return pdsName;
}

export function convertComponentData(
  prefix: string,
  data: { pdsName: string; props: Record<string, string> },
  stringKeyPair: any
) {
  const convertedName = convertComponentName(prefix, data.pdsName);
  const convertedProps = convertProps(data.props, stringKeyPair);

  return {
    pdsName: convertedName,
    props: data.props,
    displayCode: `<${convertedName} ${convertedProps} \n/>`,
  };
}
