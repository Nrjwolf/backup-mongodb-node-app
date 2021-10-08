# Backup you mongo db

```typescript
// Create your own config in src/src/configs/db.config.ts
// This is just an example: 

export default {
    bases: [
        {
            name: 'Database1',
            collections: [
                'users',
                'bills'
            ]
        },
        {
            name: 'Database2',
            collections: [
                'users',
            ]
        },
    ]
}
```
