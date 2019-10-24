// @flow strict
import React from 'react'
import { withStyles, Paper } from '@material-ui/core'

import crim from '../img/logos/crim.png'
import canarie from '../img/logos/canarie.gif'
import UdeS from '../img/logos/UdeS.jpg'
import effigis from '../img/logos/effigis.jpg'
import nrcan from '../img/logos/nrcan.gif'

const LogosContainer = withStyles(theme => {
  const { values } = theme
  return {
    root: {
      padding: values.gutterSmall,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& img': {
        padding: `0 0 0 ${values.gutterSmall}`
      }
    },
  }
})(Paper)

export function Logos() {
  return (
    <LogosContainer>
      <img alt='Logo CRIM' src={crim} />
      <img alt='Logo UdeS' src={UdeS} />
      <img alt='Logo Effigis' src={effigis} />
      <img alt='Logo NRCAN' src={nrcan} />
      <img alt='Logo Canarie' src={canarie} />
    </LogosContainer>
  )
}
