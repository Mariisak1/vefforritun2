import { useForm } from 'react-hook-form';

export function NewCourseForm({ onSubmit }) {
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    async function handleCreateCourse(data) {
        await onSubmit(data);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(handleCreateCourse)}>
            <label htmlFor='course_id'>Námskeið: </label>
            <input type='text' id='course_id' {...register('course_id', { required: 'Vantar námskeið'})} />

            <label htmlFor='title'>Nafn: </label>
            <input type='text' id='title' {...register('title', { required: 'Vantar nafn'})} />
            
            <label htmlFor='units'>Einingar: </label>
            <input type='text' id='units' {...register('units', { required: 'Vantar einingar'})} />

            <label htmlFor='semester'>Kennslumisseri: </label>
            <input type='text' id='semester' {...register('semester', { required: 'Vantar kennslumisseri'})} />

            <label htmlFor='level'>Kennslustig: </label>
            <input type='text' id='level' {...register('level')} />

            <label htmlFor='url'>Slóð: </label>
            <input type='text' id='url' {...register('url')} />

            <button type='submit'>Búa til nýjan áfanga</button>
        </form>
    );
}

export default NewCourseForm;