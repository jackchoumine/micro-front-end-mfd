import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles((theme) => {
  return createStyles({
    bar: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  })
})

export const Progress = () => {
  const classes = useStyles()

  return (
    <div className={classes.bar}>
      <LinearProgress />
    </div>
  )
}
