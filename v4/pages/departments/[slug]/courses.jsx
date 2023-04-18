import { useRouter } from 'next/router';
import Courses from '../../../components/courses/Courses';

function CoursesPage() {
    const router = useRouter();
    const { slug } = router.query;

    return (
        <div>
            <Courses slug={slug}/>
        </div>
    )
}

export default CoursesPage;