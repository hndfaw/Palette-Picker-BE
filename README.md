# Palette Picker API 
#### By [Jacqueline Moore](https://github.com/jacquelinebelle/) & [Hindreen Abdullah](https://github.com/hndfaw)

## An api that allows users to generate and store color palettes.

#### [Corresponding front-end app](https://github.com/jacquelinebelle/palette-picker-fe)

## Table of contents
* [Getting Started](#Getting-Started)
* [Documentation](#Docs)
  * [GET](#Get)
  * [POST](#POST)
  * [DELETE](#DELETE)
  * [PUT](#PUT)


## Getting Started

To use this API locally, run the following command in your terminal:

```git clone https://github.com/hndfaw/Palette-Picker-BE.git
```

Then, run the following command:

```
npm install
```

To run the app, run:

```
node server.js
```

Then, you may go to `http://localhost:3001/` in your browser to view responses.

---

## Docs

#### ROOT URL: `https://palette-picker-backend.herokuapp.com/` 

### Get All Projects
Returns all projects stored in the database.

- Method: GET
- Path: '/api/v1/projects'

##### Example response:

[
    {
       "id": "1",
        "name": "victorian house"
    },
    {
       "id": "2",
        "name": "palm tree"
    },
    {
       "id": "3",
        "name": "project 3"
    }
]

### Get Specific Projects
Returns a specific project with the id entered as a parameter.

- Method: GET
- Path: '/api/v1/projects/:id'

##### Example response:


{
    "id": "1",
    "name": "victorian house"
}

  

### Get Specific Palettes
Returns a specific project's palettes.

- Method: GET
- Path: '/api/v1/projects/:id/palettes'

- Method: GET
- Path: '/api/v1/projects'

##### Example response:


{
    "id": "1",
    "name": "victorian house"
}

  
### Post a Project

Method: POST
Path: `/api/v1/projects`

##### Example request body:

{
    "newProject": {
        "name": "project 3"
    }
}
  
  
### Post a Palette
  
Method: POST
Path: `/api/v1/projects/:id`

##### Example request body:

{
    "newPalette": {
        "name": "warm palette",
        "color_1": "FFFFF",
        "color_2": "FFFFF",
        "color_3": "FFFFF",
        "color_4": "FFFFF",
        "color_5": "FFFFF"
    }
}
  
### Modify a Project

Method: PATCH
Path: '/api/v1/projects/:id'

##### Example request body:

{
    "updatedProject": {
        "id": "1",
        "name": "georgia"
    }
}
  
### Modify a Palette
 
 Method: PATCH
 Path: `/api/v1/projects/palettes/:id`

##### Example request body:
{
    "updatedPalette": {
        "name": "blueberries",
        "color_1": "FFFFF",
        "color_2": "FFFFF",
        "color_3": "FFFFF",
        "color_4": "FFFFF",
        "color_5": "FAFAF",
    }
}
  
### Delete a Project

Method: DELETE
Path: `/api/v1/projects/:id`
  
### Delete a Palette

Method: DELETE
Path: `/api/v1/projects/palettes/:id`