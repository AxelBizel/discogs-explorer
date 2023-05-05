import React from 'react'
import { Container, Row, Col, Spinner } from 'reactstrap'

function Loader (props) {
  return (
    <div className='App'>
      <Container>
        <Row>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
        </Row>

        <Row>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
          <Col xs='6' lg='3'>
            <Spinner
              type='border'
              color='dark'
              style={{ margin: '5vh ', width: '10vw', height: '10vw' }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Loader
