import React from 'react';

export function DeleteButton({onDelete, slug}) {

    async function handleDelete() {
        await onDelete(slug);
    }

    return (
        <button onClick={handleDelete}>Eyða deild</button>
    );
}

export default DeleteButton;