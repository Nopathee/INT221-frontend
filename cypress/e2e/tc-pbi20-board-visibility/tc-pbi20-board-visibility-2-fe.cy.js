describe(`TC-PBI20-BOARD-VISIBILITY-2-FE\n 
    Test Scenario : failed
                    - un-authenticated user cannot access/manage private board.`, () => {


    it('[Step 2.1] Should not open "/board/:id" and get a message"Access denied, you do not have permission to view this page." ', () => {
        cy.visit('/board/2M6tCeErJj') // <------ add your board id here
        
        cy.on('window:alert',(str)=>{
            expect(str).to.include('Access denied, you do not have permission to view this page.')
        })

        // cy.url().should('contain','/login')
    })

    it('[Step 2.2] Should not open "/board/:id/task/:task-id" and get a message"Access denied, you do not have permission to view this page." ', () => {
        cy.visit('/board/2M6tCeErJj/task/2') // <------ add your board id here
        
        cy.on('window:alert',(str)=>{
            expect(str).to.include('Access denied, you do not have permission to view this page.')
        })

        // cy.url().should('contain','/login')
    })

    it('[Step 2.3] Should not open "/board/:id/status" and get a message"Access denied, you do not have permission to view this page." ', () => {
        cy.visit('/board/2M6tCeErJj/status') // <------ add your board id here
        
        cy.on('window:alert',(str)=>{
            expect(str).to.include('Access denied, you do not have permission to view this page.')
        })

        // cy.url().should('contain','/login')
    })

    it('[Step 2.4] Should not open "/board/:id/task/add" and get a message"Access denied, you do not have permission to view this page." ', () => {
        cy.visit('/board/2M6tCeErJj/task/add') // <------ add your board id here
        
        cy.on('window:alert',(str)=>{
            expect(str).to.include('Access denied, you do not have permission to view this page.')
        })

        // cy.url().should('contain','/login')
    })


    it('[Step 2.5] Should not open "/board/:id/task/:task-id/edit" and get a message"Access denied, you do not have permission to view this page." ', () => {
        cy.visit('/board/2M6tCeErJj/task/2/edit') // <------ add your board id and task id here
        
        cy.on('window:alert',(str)=>{
            expect(str).to.include('Access denied, you do not have permission to view this page.')
        })

        // cy.url().should('contain','/login')
    })

    it('[Step 2.6] Should not open "/board/:id/status/add" and get a message"Access denied, you do not have permission to view this page." ', () => {
        cy.visit('/board/2M6tCeErJj/status/add') // <------ add your board id here
        
        cy.on('window:alert',(str)=>{
            expect(str).to.include('Access denied, you do not have permission to view this page.')
        })

        // cy.url().should('contain','/login')
    })

    it('[Step 2.7] Should not open "/board/:id/status/:status-id/edit" and get a message"Access denied, you do not have permission to view this page." ', () => {
        cy.visit('/board/2M6tCeErJj/status/2/edit') // <------ add your board id and status id here
        
        cy.on('window:alert',(str)=>{
            expect(str).to.include('Access denied, you do not have permission to view this page.')
        })

        // cy.url().should('contain','/login')
    })

})