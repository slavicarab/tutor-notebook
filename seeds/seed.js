module.exports.students = [
    {
        name: { first: 'John', last: 'Doe' },
        age: {
            kindergarten: { age: '5' },
            primary_school: null,
            secondary_school: null,
        },
        email: 'john.doe@example.com',
        address: '123 Main St, Springfield',
        phoneNumber: '123-456-7890',
        parent: {
            name: 'Jane Doe',
            phoneNumber: '987-654-3210',
        },
        description: 'A bright and curious student.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: { first: 'Alice', last: 'Johnson' },
        age: {
            kindergarten: null,
            primary_school: { grade: '3', school: 'Springfield Elementary' },
            secondary_school: null,
        },
        email: 'alice.johnson@example.com',
        address: '456 Elm St, Springfield',
        phoneNumber: '234-567-8901',
        parent: {
            name: 'Robert Johnson',
            phoneNumber: '876-543-2109',
        },
        description: 'Loves reading and science.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: { first: 'Bob', last: 'Brown' },
        age: {
            kindergarten: null,
            primary_school: null,
            secondary_school: { grade: '7', school: 'Springfield High' },
        },
        email: 'bob.brown@example.com',
        address: '789 Oak St, Springfield',
        phoneNumber: '345-678-9012',
        parent: {
            name: 'Susan Brown',
            phoneNumber: '765-432-1098',
        },
        description: 'Enjoys sports and teamwork.',
        active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];


