import React from 'react'

import { Divide as Hamburger } from 'hamburger-react'
import theme from '../../theme'

export const NavbarIcon = ({ isOpen }) => {
    return (
        <Hamburger
            toggled={isOpen}
            size={30}
            duration={0.4}
            easing="ease-in"
            rounded
            label="Show menu"
            color={theme.colors.green[500]}
        />
    )
}
