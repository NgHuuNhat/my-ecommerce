import { collection, getDocs } from 'firebase/firestore'
import React from 'react'
import { db } from './firebase'

export default async function TestConnect() {
    const snapshot = await getDocs(collection(db, "test"))

    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    console.log("TestConnect-Success:", data)
    return (
        <div>
            <div>TestConnect-Success: </div>
            <div>{JSON.stringify(data)}</div>
        </div>
    )
}
