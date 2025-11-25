# Node.js Developer Assignment — Dynamic Form Builder (Single Task) #

Nice — here's a clear, testable assignment you can give a Node.js candidate. It focuses on building a dynamic form system where an admin creates form fields and end-users submit data that’s stored in a database.

# Goal

Build a small web app (backend + minimal admin UI) that allows an admin to define forms and fields via an admin panel, and allows users to load those forms and submit responses. Submissions must be saved in a database and retrievable via API.

# Requirements (must-haves)

1. Admin features

    Create / edit / delete a Form (title, description).

    For each Form, create / edit / delete Fields with these properties:

        label (string)

        type (text, textarea, number, email, date, checkbox, radio, select)

        Condition: If Radio or Select is choosen, then create nested fields upon option choice.

        name (string, unique within form)

        required (boolean)

        options (array — for select/radio/checkbox)

        validation (min/max/regex as applicable)

        order (to control display order)

    Reorder fields (drag/drop — simple order number is fine).

2. Public/User features

    List available forms (GET).

    Render a form dynamically based on field definitions.

    Submit the form; the server validates values according to field definitions, returns errors if invalid.

    Save successful submissions to DB, associated with the formId.

3. APIs

    Admin endpoints to manage forms and fields (create/read/update/delete).

    Endpoint to fetch a form definition (for rendering).

    Endpoint to submit form response.

Endpoint to list form submissions (admin).

4. Persistence

    Use a database (MongoDB ) to store:

        Form definitions and fields

        Form submissions (store raw answers + metadata like submittedAt, ip optional)

5. Validation

    Server-side validation based on field config.

    Proper error messages for invalid submissions.

6. Security & basics

    Minimal admin authentication (can be a simple token or basic auth).

    Input sanitization to prevent injection.

    Clear README with run & test instructions.

# Nice-to-haves / Bonus

    Frontend: small React  admin panel and form renderer.

    File upload field support (store in local folder or base64).

    Versioning of form definitions (so older submissions keep their schema).

    Pagination & filtering for submissions.

    Unit & integration tests for core logic (validation + endpoints).

    Dockerfile / docker-compose to run the app + DB.

    Export submissions as CSV.

# Suggested Tech Stack (candidate may choose alternatives)

    Runtime: Node.js (v22+)

    DB: MongoDB

    