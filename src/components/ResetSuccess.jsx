import React from 'react'

const STYLE = {
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    marginTop: '1rem',
}

function ResetSuccess() {
    return (
        <div style={STYLE}>
            <h1 style={{ fontFamily: 'sans-serif, roboto', fontSize: '65px' }}>
                Success!
            </h1>
            <p style={{ fontFamily: 'sans-serif, roboto', fontSize: '15px' }}>
                Please check your email.
            </p>
        </div>
    )
}

export default ResetSuccess
