import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { HorizontalBar } from 'react-chartjs-2'

const DashboardStyles = styles => {
  let stylesArray = styles.styles
    .join(',')
    .split(',')
    .sort()

  let graphLabels = []
  let graphValues = []

  for (let i = 0; i < stylesArray.length; i++) {
    if (graphLabels.includes(stylesArray[i])) {
      graphValues[graphLabels.indexOf(stylesArray[i])] += 1
    } else {
      graphLabels.push(stylesArray[i])
      graphValues.push(1)
    }
  }
//Suppression style vides
  if (graphLabels[0].length === 0) {
    graphLabels = graphLabels.slice(1)
    graphValues = graphValues.slice(1)
  }

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let sum = graphValues.reduce(reducer);
  let graphLabelsSliced = [];
  let graphValuesSliced = [];

  for (let i = 0; i < graphValues.length; i++) {
    if (graphValues[i] / sum > 0.01) {
      graphLabelsSliced.push(graphLabels[i]);
      graphValuesSliced.push(graphValues[i]);
    }
  }



  const data = {
    labels: graphLabelsSliced,
    datasets: [
      {
        label: 'Nombre de disques dans la collection',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: graphValuesSliced
      }
    ]
  }

  return (
    <>
      {' '}
      {styles ? (
        <HorizontalBar data={data} width={100} height={375} />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </>
  )
}
export default DashboardStyles
