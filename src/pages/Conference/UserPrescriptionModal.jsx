import React, { useEffect, useState } from "react";
// import { Modal, Button } from "@material-ui/core";
import { Button, Modal, Table } from "react-bootstrap";
import { echo } from "../../lib/pusher";
import { API_URL } from "../../lib/api";

const UserPrescriptionModal = ({ open, onClose, patientId, onEndCall}) => {
  const [tbodyData, setTbodyData] = useState([]);
  const [prescriptionId, setPrescriptionId] = useState(null);

  useEffect(() => {
    const handleNewPrescription = (e) => {
      setTbodyData(e.carts);
      setPrescriptionId(e.prescription_id);
      alert('Bạn có đơn hàng mới của bác sĩ');
    };

    echo
      .channel("messages." + patientId)
      .listen("NewMessage", handleNewPrescription);

    return () => {
      // Cleanup code when the component unmounts
      echo.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(tbodyData);
  }, [tbodyData]);

  return (
    <Modal show={open} onHide={onClose} centered size="lg">
      <Modal.Header>
        <Modal.Title className="d-flex align-items-center justify-content-center w-100">
          Đơn thuốc của bạn
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table
          striped
          bordered
          hover
          style={{ maxHeight: "400px", overflow: "auto" }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Ngày điều trị</th>
              <th>Lưu ý</th>
            </tr>
          </thead>
          <tbody>
            {tbodyData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Bạn hiện chưa có đơn thuốc
                </td>
              </tr>
            ) : (
              tbodyData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <p>{data.product_name}</p>
                    <img src={API_URL + data.product_thumbnail} alt="Product" width={200}/>
                  </td>
                  <td>{data.quantity}</td>
                  <td>{data.treatment_days}</td>
                  <td>{data.note}</td>
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
        {prescriptionId && (
          <Button
            variant="primary"
            onClick={() => {
              onEndCall();
              window.open(
                API_URL + `/checkout?prescription_id=` + prescriptionId,
                "_blank"
              );
            }}
          >
            Tới trang thanh toán
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserPrescriptionModal;
