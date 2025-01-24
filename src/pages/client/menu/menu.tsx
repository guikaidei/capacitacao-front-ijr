import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components
const Container = styled.div`
  padding: 20px;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const ReservationList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 250px); // Adjust height to leave space for title and button
  overflow-y: auto; // Enable vertical scrolling
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #2196F3;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;

  &:hover {
    background-color: #1976D2;
  }
`;



const ReservationItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
`;

const ReservationText = styled.div`
  text-align: left;
  flex-grow: 1;
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const CloseButton = styled(Button)`
  background-color: #e0e0e0;
  color: black;

  &:hover {
    background-color: #d5d5d5;
  }
`;

// Helper function to get today's date components
const getTodayComponents = () => {
  const today = new Date();
  return {
    day: String(today.getDate()).padStart(2, '0'),
    month: String(today.getMonth() + 1).padStart(2, '0'),
    year: String(today.getFullYear()),
  };
};

// Component
export const Menu: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    day: '',
    month: '',
    year: '',
    inicial_time: '',
    pessoas: '',
  });

  useEffect(() => {
    // Preenche os campos iniciais do formulário com a data atual
    const { day, month, year } = getTodayComponents();
    setFormData(prev => ({ ...prev, day, month, year }));
  }, []);

  // Fetch reservations from the API
  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/admin/get-reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Delete reservation
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/admin/delete-reservation/${id}`);
      fetchReservations();
    } catch (error) {
      console.error('Erro ao deletar a reserva:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create a new reservation
  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:8000/client/create-reservation', {
        client: formData.client,
        status: "agendada",
        day: parseInt(formData.day, 10),
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
        inicial_time: formData.inicial_time,
        pessoas: parseInt(formData.pessoas, 10),
      });

      
      fetchReservations();
      setIsModalOpen(false);

      // Reset form data
      const { day, month, year } = getTodayComponents();
      setFormData({
        client: '',
        day,
        month,
        year,
        inicial_time: '',
        pessoas: '',
      });
    } catch (error) {
      console.error('Erro ao criar a reserva:', error);
    }
  };

  return (
    <Container>
      <Title>Reservas</Title>

      <ReservationList>
        {reservations.map(reservation => (
          <ReservationItem key={reservation._id}>
            <ReservationText>
              <strong>Cliente:</strong> {reservation.client} <br />
              <strong>Data:</strong> {`${String(reservation.day).padStart(2, '0')}/${String(reservation.month).padStart(2, '0')}/${reservation.year}`} <br />
              <strong>Hora:</strong> {reservation.inicial_time} <br />
              <strong>Pessoas:</strong> {reservation.pessoas}
            </ReservationText>
            <DeleteButton onClick={() => handleDelete(reservation._id)}>Apagar</DeleteButton>
          </ReservationItem>
        ))}
      </ReservationList>

      <Button onClick={() => setIsModalOpen(true)}>Criar Reserva</Button>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalTitle>Criar Reserva</ModalTitle>
            <Form onSubmit={handleCreateReservation}>
              <Input
                type="text"
                name="client"
                placeholder="Cliente"
                value={formData.client}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="day"
                placeholder="Dia"
                value={formData.day}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="month"
                placeholder="Mês"
                value={formData.month}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="year"
                placeholder="Ano"
                value={formData.year}
                onChange={handleChange}
                required
              />
              <Input
                type="time"
                name="inicial_time"
                placeholder="Hora Inicial (HH:mm)"
                value={formData.inicial_time}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="pessoas"
                placeholder="Número de Pessoas"
                value={formData.pessoas}
                onChange={handleChange}
                required
              />
              <Button type="submit">Salvar</Button>
              <CloseButton onClick={() => setIsModalOpen(false)}>Cancelar</CloseButton>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};
