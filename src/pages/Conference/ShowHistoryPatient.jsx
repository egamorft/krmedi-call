import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";

const ShowHistoryPatient = ({ open, onClose, patientId }) => {
    const [selectedValue, setSelectedValue] = useState("1");

    useEffect(() => {
      if (patientId) {
        fetch(`https://krmedi.vn/api/my-bookings/history/${patientId}`)
          .then((res) => res.json())
          .then((res) => {
            setSelectedValue(res ? "1" : "0");
          })
          .catch((error) => {
            console.log(error)
          });
      }
    }, [patientId]);

    const handleChangeRadio = (event) => {
      setSelectedValue(event.target.value);
  };

  const updateMedicalHistory = async (patientId, selectedValue) => {
    try {
      const response = await fetch(`https://krmedi.vn/api/my-bookings/history/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ is_check_medical_history: selectedValue }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error updating medical history:", error);
      return null;
    }
  };
  const handleSubmitHistoryPatient = () => {
    updateMedicalHistory(patientId, selectedValue)
      .then(result => {
        if (result) {
          console.log("Medical history updated successfully");
        } else {
          console.error("Failed to update medical history");
        }
        onClose(); // Optionally close the modal after submitting
      });
  };

    return (
        <Modal show={open} onHide={onClose} centered size="lg">
            <Modal.Header>
                <Modal.Title className="d-flex align-items-center justify-content-center w-100">
                    Chia sẻ lịch sử khám cho Bác Sĩ
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RadioGroup aria-label="share-history" value={selectedValue} onChange={handleChangeRadio} className="justify-content-center" style={{gap: '25px', flexDirection: 'row'}}>
                    <FormControlLabel value="1" control={<Radio />} label="Có" />
                    <FormControlLabel value="0" control={<Radio />} label="Không" />
                </RadioGroup>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleSubmitHistoryPatient}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowHistoryPatient;
