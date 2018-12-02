export interface CurriculumSubjectsList {
    id: number,
    section_times: {
        id: number,
        week: number,
        section: number,
        start_time: string,
        end_time: string,
        subjects: number
    },
    subjects_name: string,
    class_room: string,
    year: string,
    semester: string,
    teacher: string
}
