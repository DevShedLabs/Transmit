// src/components/Transmit/utils/environment.js
export const replaceEnvironmentVariables = ( text, environment ) => {
    if ( !environment || !text ) return text;

    return text.replace( /{{(.+?)}}/g, ( match, variable ) => {
        const key = variable.trim();
        return environment.variables[ key ] || match;
    } );
};

export const validateEnvironment = ( environment ) => {
    const errors = [];

    if ( !environment.name ) {
        errors.push( 'Environment name is required' );
    }

    if ( !environment.variables || typeof environment.variables !== 'object' ) {
        errors.push( 'Environment variables must be an object' );
    }

    return errors;
};

export const exportEnvironment = ( environment ) => {
    return {
        name:        environment.name,
        variables:   { ...environment.variables },
        exported_at: new Date().toISOString()
    };
};
