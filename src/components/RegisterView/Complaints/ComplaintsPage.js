import { useContext } from "react";
import { Container, Spinner, Button, Row, Col } from "react-bootstrap";
import { BiCheck, BiX } from "react-icons/bi";
import BackHeader from "../../UI/BackHeader";
import LabelDescripField from "../../UI/LabelDescripField";
import { GlobalContext } from "../../../GlobalContext";

import classes from "./ComplaintsPage.module.css";

const ComplaintsPage = () => {
  const { complaintHook } = useContext(GlobalContext);
  const { complaintsList, resolveComplaint, loading, refreshComplaintsList } =
    complaintHook;

  const handleResult = async (complaintInfo, resultType) => {
    await resolveComplaint(complaintInfo, resultType);
  };

  const complaints = complaintsList.map((complaint) => (
    <ComplaintWidget
      key={complaint.id}
      complaint={complaint}
      handleResult={handleResult}
    />
  ));

  return (
    <Container>
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Complaints"
      />
      {complaints.length > 0 && complaints}

      <div className="d-flex justify-content-center flex-column">
        {loading && (
          <div className="my-3 d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        )}
        {!loading && complaints.length === 0 && <p>There are no complaints.</p>}
        <Button
          className="my-3"
          onClick={refreshComplaintsList}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
    </Container>
  );
};

const ComplaintWidget = ({ complaint, handleResult }) => {
  const { reporter, offender, reason, outcome } = complaint;

  return (
    <div className={classes.complaint}>
      <Row className="d-flex align-items-center">
        <Col>
          <Row>
            <Col>
              <LabelDescripField
                label="Reporter: "
                description={`${reporter.name} (${reporter.userType})`}
              />
            </Col>

            <Col>
              <LabelDescripField
                label="Offender: "
                description={`${offender.name} (${offender.userType})`}
              />
            </Col>
          </Row>

          <LabelDescripField label="Description: " description={reason} />

          {reporter.userType === "instructor" && (
            <LabelDescripField label="Outcome: " description={outcome} />
          )}
        </Col>
        <Col sm="auto" className="text-center">
          <Button
            variant="success"
            className="mx-1"
            onClick={() => handleResult(complaint, "approve")}
          >
            <BiCheck />
          </Button>
          <Button
            variant="danger"
            className="mx-1"
            onClick={() => handleResult(complaint, "reject")}
          >
            <BiX />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ComplaintsPage;
