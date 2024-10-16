import React, { useEffect, useState } from "react";
// import { Modal, Button } from "@material-ui/core";
import { Button, Modal, Table } from "react-bootstrap";
import {viewPatientHistory} from '../../lib/api'

const ShowHistoryExamination = ({ open, onClose, doctorId }) => {
    const [tbodyData, setTbodyData] = useState([]);

    useEffect(() => {
      if (doctorId && open) {
        fetch(`https://krmedi.vn/api/my-bookings/list/${doctorId}`)
          .then((res) => res.json())
          .then((res) => {
            if (Array.isArray(res)) {
              setTbodyData(res);
            } else {
              setTbodyData([]); 
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setTbodyData([]);
          });
      }
    }, [doctorId, open]);

  return (
    <Modal show={open} onHide={onClose} centered size="lg">
      <Modal.Header>
        <Modal.Title className="d-flex align-items-center justify-content-center w-100">
          Lịch sử khám
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: "auto" }}>
        <Table
          striped
          bordered
          hover
          style={{ maxHeight: "400px", overflow: "auto" }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Phòng khám</th>
              <th>Giờ vào</th>
              <th>Dịch vụ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {tbodyData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Chưa có lịch sử khám
                </td>
              </tr>
            ) : (
              tbodyData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <p>{data.name_clinic}</p>
                  </td>
                  <td>{data.check_in}</td>
                  <td>{data.service_names}</td>
                  <td>{data.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowHistoryExamination;
