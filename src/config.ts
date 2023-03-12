const getEnvironmentVariable = (environmentVariable: string): string => {
    const unvalidatedEnvironmentVariable = process.env[environmentVariable]
    if (!unvalidatedEnvironmentVariable) {
        throw new Error(
            `Couldn't find environment variable: ${environmentVariable}`
        )
    } else {
        return unvalidatedEnvironmentVariable
    }
}

export const config = {
    sendGridApiKey: getEnvironmentVariable('SENDGRID_API_KEY'),
    domainEmail: getEnvironmentVariable('DOMAIN_EMAIL'),
}
