import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
    // currentPassword: '',
    // newPassword: '',
    // confirmPassword: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    user?.profileImage || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.firstName}+${user?.lastName}`
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // const handleProfileUpdate = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
  //       setError('Le password non coincidono');
  //       return;
  //     }

  //     const response = await axios.put(`http://localhost:5020/api/users/${user._id}`, {
  //       firstName: formData.firstName,
  //       lastName: formData.lastName,
  //       currentPassword: formData.currentPassword,
  //       newPassword: formData.newPassword
  //     });

  //     login(response.data); // Aggiorna i dati dell'utente nel context
  //     setSuccess('Profilo aggiornato con successo');
  //     setError('');

  //     // Resetta i campi password
  //     setFormData(prev => ({
  //       ...prev,
  //       currentPassword: '',
  //       newPassword: '',
  //       confirmPassword: ''
  //     }));
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Errore durante aggiornamento del profilo');
  //     setSuccess('');
  //   }
  // };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      
      // Aggiungi l'immagine solo se è stata modificata
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await axios.put(
        `http://localhost:5020/api/users/${user._id}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      login(response.data); // Aggiorna i dati dell'utente nel context
      setSuccess('Profilo aggiornato con successo');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante aggiornamento del profilo');
      setSuccess('');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Le password non coincidono');
        return;
      }

      await axios.put(`http://localhost:5020/api/users/${user._id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setSuccess('Password aggiornata con successo');
      setPasswordError('');
      setShowPasswordModal(false);
      
      // Resetta i campi password
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Errore durante aggiornamento della password');
    }
  };

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4">Gestisci Profilo</h2>
//       {error && <Alert variant="danger">{error}</Alert>}
//       {success && <Alert variant="success">{success}</Alert>}

//       <Row className="justify-content-md-center">
//         <Col md={6}>
//           <Form onSubmit={handleProfileUpdate}>
//             <Form.Group className="mb-3">
//               <Form.Label>Nome</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Cognome</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 value={formData.email}
//                 disabled
//               />
//             </Form.Group>

//             <h4 className="mt-4">Modifica Password</h4>

//             <Form.Group className="mb-3">
//               <Form.Label>Password Attuale</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="currentPassword"
//                 value={formData.currentPassword}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Nuova Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Conferma Nuova Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit" className="w-100">
//               Aggiorna Profilo
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

return (
  <Container className="mt-4">
    <h2 className="mb-4 text-white">Gestione Profilo</h2>
    {error && <Alert variant="danger">{error}</Alert>}
    {success && <Alert variant="success">{success}</Alert>}
    
    <Row className="justify-content-md-center">
      <Col md={6}>
        <Form onSubmit={handleProfileUpdate} encType="multipart/form-data">
          <div className="text-center mb-4">
            <Image 
              src={previewUrl} 
              roundedCircle 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
              className="mb-3"
            />
            <Form.Group>
              <Form.Label className="btn btn-outline-primary d-block">
                Cambia immagine profilo
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </Form.Label>
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Nome</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Cognome</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              disabled
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Aggiorna Profilo
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowPasswordModal(true)}
            >
              Modifica Password
            </Button>
          </div>
        </Form>
      </Col>
    </Row>

    {/* Modal per la modifica della password */}
    <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {passwordError && <Alert variant="danger">{passwordError}</Alert>}
        <Form onSubmit={handlePasswordUpdate}>
          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Password Attuale</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Nuova Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Conferma Nuova Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Aggiorna Password
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  </Container>
);
};

export default Profile;