const Header = ({ title }) => <h1>{title}</h1>

const Content = ({ parts }) => parts.map(part => <Part key={part.id} part={part} />)

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return <strong>total of {total} exercises</strong>
}

const Course = ({ course }) => {
    return (
        <>
            <Header title={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

export default Course