const equationRegex = /^\d+(?:\s*[+\-/*^]\s*\d+)+$/

const numberRegex = /^\s*\d+\s*$/

export const sleep = async (seconds: number) =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000))