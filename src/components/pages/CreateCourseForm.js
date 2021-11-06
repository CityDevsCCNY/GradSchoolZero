import { useContext, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import useInstructorFetch from "../../hooks/useInstructorFetch";

import { Button, Form, Card, Row, Col, Container, Alert } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

import { convert23Time, isAfter } from "../../helpers/time";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreateCourse = () => {
  const { termInfo } = useContext(GlobalContext);
  const { nonSuspsendedInstructors: instructors } = useInstructorFetch();

  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    instructorId: "",
    instructorName: "",
    maxCapacity: 5,
    courseTimes: [],
    newDay: "",
    newStart: "",
    newEnd: "",
  });
  const [addTimeError, setAddTimeError] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const removeTime = (idx) => {
    const newTimes = courseInfo.courseTimes.filter((time, tIdx) => tIdx !== idx);
    setCourseInfo({ ...courseInfo, courseTimes: newTimes });
  };

  const addTime = () => {
    const validTime = isAfter(courseInfo.newStart, courseInfo.newEnd);

    if (courseInfo.newDay && courseInfo.newStart && courseInfo.newEnd && validTime) {
      const newTimes = [
        ...courseInfo.courseTimes,
        { day: courseInfo.newDay, start: courseInfo.newStart, end: courseInfo.newEnd },
      ];
      setAddTimeError(false);
      setCourseInfo({
        ...courseInfo,
        courseTimes: newTimes,
        newDay: "",
        newStart: "",
        newEnd: "",
      });
    } else {
      setAddTimeError(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInstructor = (e) => {
    const { value } = e.target;
    const [id, name] = value.split(",");
    setCourseInfo((prevState) => ({
      ...prevState,
      instructorId: id,
      instructorName: name,
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    /* Do form validations & add any erros to formErrors */
    /* Check to see if times are conflicting */

    setTimeout(() => {
      setLoading(false);
      /* Submit Form to server */

      setSuccess(true);
    }, 500);
  };

  /* 
    Check if current phase is course setup
  */

  if (success) {
    return (
      <Container>
        <Alert variant="success" className="mx-auto mt-5">
          <Alert.Heading>Success!</Alert.Heading>
          <p>
            Successfully created course for the {termInfo.semester} {termInfo.year} semster:
          </p>
          <hr />
          <p className="mb-0">
            <span className="fw-bold">Course Name: </span>
            <span className="font-monospace">{courseInfo.courseName}</span>
            <br />
            <span className="fw-bold">Course Instructor: </span>
            <span className="font-monospace">
              {courseInfo.instructorName} ({courseInfo.instructorId})
            </span>
            <br />
            <span className="fw-bold">Max Capacity: </span>
            <span className="font-monospace">{courseInfo.maxCapacity}</span>
            <br />
          </p>
          <p className="fw-bold my-0">Times:</p>
          <ul className="m-0">
            {courseInfo.courseTimes.map((time, idx) => (
              <li className="my-1" key={idx}>
                {time.day} | {convert23Time(time.start)} - {convert23Time(time.end)}
              </li>
            ))}
          </ul>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Card style={{ maxWidth: "50rem" }} className="mx-auto mt-5">
        <Card.Body>
          <h1 className="text-center">Create A Course</h1>
          {/* 
            Form error notificaitons
          <Alert variant="danger">Test</Alert>
          */}

          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3" controlId="formHorizontalCourseName">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Course Name"
                name="courseName"
                value={courseInfo.courseName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formHorizontalInstructor">
              <Form.Label>Instructor</Form.Label>
              <Form.Select name="instructorId" defaultValue="" onChange={handleInstructor} required>
                <option value="" disabled>
                  Select an Instructor
                </option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={`${instructor.id},${instructor.name}`}>
                    {instructor.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formHorizontalMaxCapacity">
              <Form.Label>Course Max Capacity</Form.Label>
              <Form.Control
                type="number"
                min="5"
                name="maxCapacity"
                value={courseInfo.maxCapacity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formHorizontalTimes">
              <Form.Label>Course Times</Form.Label>

              {courseInfo.courseTimes.map((time, idx) => (
                <div key={idx}>
                  <Row className="d-flex align-items-center my-1">
                    <Col>
                      <p className="mb-0">{time.day}</p>
                      <p className="text-muted mb-0">
                        {convert23Time(time.start)} - {convert23Time(time.end)}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Button variant="danger" onClick={() => removeTime(idx)}>
                        <FaTrashAlt />
                      </Button>
                    </Col>
                  </Row>
                  {idx < courseInfo.courseTimes.length - 1 ? <hr /> : null}
                </div>
              ))}
              {/* Add course time row */}
              <Row className="d-flex mt-3 align-items-center">
                <Col>
                  <Row className="d-flex mt-2 align-items-center">
                    <Col className="my-1">
                      <Form.Select
                        name="newDay"
                        value={courseInfo.newDay}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Select an Day
                        </option>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    {/* Time fields */}
                    <Col className="my-1">
                      <Form.Control
                        type="time"
                        name="newStart"
                        value={courseInfo.newStart}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col xs="auto" className="my-1">
                      —
                    </Col>
                    <Col className="my-1">
                      <Form.Control
                        type="time"
                        name="newEnd"
                        value={courseInfo.newEnd}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs="auto">
                  <Button
                    variant={addTimeError ? "danger" : "secondary"}
                    className="my-1"
                    onClick={addTime}
                  >
                    Add Time
                  </Button>
                </Col>
              </Row>
            </Form.Group>

            <Button
              style={{ width: "100%" }}
              variant="primary"
              type="submit"
              disabled={loading ? true : false}
            >
              Create Course
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateCourse;
