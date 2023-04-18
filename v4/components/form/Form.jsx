import { useForm } from 'react-hook-form';

export function Form({ onSubmit }) {
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    async function handleCreateDepartment(data) {
        await onSubmit(data.newTitle);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(handleCreateDepartment)}>
            <label htmlFor='newTitle'>Ný deild: </label>
            <input type='text' id='newTitle' {...register('newTitle', { required: 'Settu inn nafn'})}>
            </input>
            <button type='submit'>Búa til nýja deild</button>
        </form>
    );
}

export default Form;