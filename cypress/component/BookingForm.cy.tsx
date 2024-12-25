import React from 'react'
import BookingForm from '../../components/BookingForm'
import { mount } from 'cypress/react18'

describe('BookingForm', () => {
  it('renders correctly', () => {
    mount(<BookingForm />)
    cy.get('form').should('exist')
    cy.get('button[type="submit"]').should('contain', 'Search')
  })

  it('allows user to fill out the form', () => {
    mount(<BookingForm />)
    cy.get('select[id="pickup"]').select('airport')
    cy.get('select[id="dropoff"]').select('hotel')
    cy.get('input[id="passengers"]').type('2')
    cy.get('input[id="departureTime"]').type('14:00')
    cy.get('button[type="submit"]').click()
  })
})

