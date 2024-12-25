describe('Booking Flow', () => {
  it('allows a user to make a reservation', () => {
    cy.visit('/')
    
    // Fill out the booking form
    cy.get('select[id="pickup"]').select('airport')
    cy.get('select[id="dropoff"]').select('hotel')
    cy.get('input[id="passengers"]').type('2')
    cy.get('input[id="departureDate"]').type('2023-12-01')
    cy.get('input[id="departureTime"]').type('14:00')
    
    // Submit the form
    cy.get('button[type="submit"]').click()
    
    // Assert that we're on the search results page
    cy.url().should('include', '/search')
    
    // Select a vehicle
    cy.contains('Add to Cart').first().click()
    
    // Go to cart
    cy.contains('View Cart').click()
    
    // Proceed to checkout
    cy.contains('Proceed to Checkout').click()
    
    // Fill out payment information
    cy.get('input[id="cardNumber"]').type('4111111111111111')
    cy.get('input[id="expiryDate"]').type('12/25')
    cy.get('input[id="cvv"]').type('123')
    
    // Complete the reservation
    cy.contains('Complete Reservation').click()
    
    // Assert that the reservation was successful
    cy.contains('Reservation Confirmed').should('be.visible')
  })
})

