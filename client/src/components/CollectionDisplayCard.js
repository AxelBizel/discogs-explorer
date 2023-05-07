import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Axios from "axios";

function CollectionDisplayCard({ item, index }) {
  const [delay, setDelay] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [discogsLink, setDiscogsLink] = useState(null);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (window.matchMedia("(min-width: 992px)").matches) {
      setDelay((index % 12) * 50);
    } else if (window.matchMedia("(min-width: 768px)").matches) {
      setDelay((index % 6) * 50);
    } else if (window.matchMedia("(min-width: 576px)").matches) {
      setDelay((index % 4) * 50);
    } else {
      setDelay((index % 3) * 50);
    }
  }, [index]);

  const getExternalLink = useCallback(async () => {
    const link = await Axios.get(item.resourceUrl);
    setDiscogsLink(link.data.uri);
  }, [item]);

  useEffect(() => {
    if (showModal) {
      getExternalLink();
    }
  }, [showModal, getExternalLink]);

  return (
    <>
      <Col
        xs="4"
        sm="3"
        md="2"
        lg="1"
        key={index}
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-delay={delay}
        style={{ margin: 0, padding: 0 }}
      >
        <div
          onClick={toggleModal}
          style={{
            margin: 5,
            alignItems: "center",
            textAlign: "center",
            padding: "auto",
          }}
        >
          <img
            alt="coverThumbnail"
            className="coverThumbnail"
            src={item.coverThumbnail}
          />
        </div>
      </Col>
      {showModal && (
        <Modal isOpen={showModal} toggle={toggleModal} centered>
          <ModalHeader>
            <img src={item.coverUrl} width={"100%"} alt="Release cover" />
          </ModalHeader>
          <ModalBody>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {item.artists_releases.map((a) => ` ${a.artists.name}`).join(",")}
            </span>
            <br />
            {item.title}
            <br />
            <span
              style={{
                textDecoration: "italic",
                fontSize: "0.8em",
              }}
            >
              {item.labels_releases.length > 1 ? "Labels :" : "Label :"}
              {item.labels_releases.map((l) => ` ${l.labels.name}`).join(",")}
            </span>
            <br />
            <span style={{ textDecoration: "italic", fontSize: "0.8em" }}>
              Release year : {item.releaseYear}
            </span>
          </ModalBody>
          <ModalFooter>
            {discogsLink && (
              <a href={discogsLink} target="_blank" rel="noopener noreferrer">
                <Button color="#fff">View on Discogs</Button>
              </a>
            )}
            <Button color="secondary" onClick={toggleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}

export default CollectionDisplayCard;
