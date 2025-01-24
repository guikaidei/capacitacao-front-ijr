import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Reservation {
  _id: string;
  client: string[];
  status: string;
  day: number;
  month: number;
  year: number;
  inicial_time: string;
  pessoas: number;
}

const Container = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
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
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  span:first-child {
    font-weight: bold;
    margin-right: 10px;
    min-width: 150px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  
  ${props => props.$variant === 'primary' && `
    background-color: #2196F3;
    color: white;
    &:hover { background-color: #1976D2; }
  `}
  
  ${props => props.$variant === 'danger' && `
    background-color: #f44336;
    color: white;
    &:hover { background-color: #d32f2f; }
  `}
  
  ${props => props.$variant === 'secondary' && `
    background-color: #e0e0e0;
    color: #333;
    &:hover { background-color: #d5d5d5; }
  `}
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
`;

const Sidebar = styled.div`
  background-color: #f4f4f4;
  border-radius: 8px;
  padding: 20px;
`;

const MonthSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const CalendarDay = styled.div<{ 
  $isCurrentMonth: boolean, 
  $hasReservations: boolean, 
  $isSelected: boolean 
}>`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  min-height: 100px;
  cursor: pointer;
  background-color: ${props => 
    props.$isSelected ? '#e0f7fa' :
    props.$hasReservations ? '#e6f3ff' : 
    props.$isCurrentMonth ? 'white' : '#f9f9f9'};
  position: relative;
`;

const DayNumber = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  text-align: right;
`;

const ReservationTag = styled.div<{ $status: string }>`
  background-color: ${props => 
    props.$status === 'agendada' ? '#4CAF50' :
    props.$status === 'confirmada' ? '#2196F3' :
    '#FF9800'};
  color: white;
  border-radius: 4px;
  padding: 3px 6px;
  margin-bottom: 3px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const TimetableContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const TimetableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  background-color: #f4f4f4;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const TimetableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;
  }
`;

export const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/admin/get-reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Erro ao buscar as reservas:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDeleteReservation = async () => {
    if (!selectedReservation) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/admin/delete-reservation/${selectedReservation._id}`);
      setReservations(prev => prev.filter(r => r._id !== selectedReservation._id));
      setSelectedReservation(null);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar a reserva:", error);
    }
  };

  const handleFinalizarReservation = async () => {
    if (!selectedReservation) return;

    try {
      await axios.put(`http://127.0.0.1:8000/admin/update-reservation/${selectedReservation._id}`, {
        status: 'finalizada'
      });
      
      setReservations(prev => 
        prev.map(r => 
          r._id === selectedReservation._id 
            ? {...r, status: 'finalizada'} 
            : r
        )
      );
      
      setSelectedReservation(null);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao finalizar a reserva:", error);
    }
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar = [];

    for (let i = 0; i < startingDay; i++) {
      calendar.push({ day: null, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayReservations = reservations.filter(
        r => r.day === i && r.month === month + 1 && r.year === year
      );
      calendar.push({ 
        day: i, 
        isCurrentMonth: true,
        reservations: dayReservations 
      });
    }

    return calendar;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const renderReservationModal = () => {
    if (!selectedReservation) return null;

    return (
      <Modal>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Detalhes da Reserva</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <DetailRow>
              <span>Cliente:</span>
              <span>{selectedReservation.client}</span>
            </DetailRow>
            <DetailRow>
              <span>Data:</span>
              <span>{`${selectedReservation.day}/${selectedReservation.month}/${selectedReservation.year}`}</span>
            </DetailRow>
            <DetailRow>
              <span>Hora Inicial:</span>
              <span>{selectedReservation.inicial_time}</span>
            </DetailRow>
            <DetailRow>
              <span>Status:</span>
              <span>{selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}</span>
            </DetailRow>
            <DetailRow>
              <span>Número de Pessoas:</span>
              <span>{selectedReservation.pessoas}</span>
            </DetailRow>
          </ModalBody>
          <ButtonGroup>
            {selectedReservation.status === 'agendada' && (
              <Button $variant="primary" onClick={handleFinalizarReservation}>
                Finalizar
              </Button>
            )}
            <Button $variant="danger" onClick={handleDeleteReservation}>
              Deletar
            </Button>
            <Button $variant="secondary" onClick={() => setSelectedReservation(null)}>
              Fechar
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    );
  };

  const renderCalendar = () => {
    const calendar = generateCalendar();
    return (
      <CalendarContainer>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>{day}</div>
        ))}
        {calendar.map((calendarDay, index) => (
          <CalendarDay 
            key={index} 
            $isCurrentMonth={calendarDay.isCurrentMonth}
            $hasReservations={!!(calendarDay.reservations && calendarDay.reservations.length > 0)}
            $isSelected={selectedDay === calendarDay.day}
            onClick={() => setSelectedDay(calendarDay.day)}
          >
            {calendarDay.day && (
              <>
                <DayNumber>{calendarDay.day}</DayNumber>
                {calendarDay.reservations?.map(reservation => (
                  <ReservationTag 
                    key={reservation._id} 
                    $status={reservation.status}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReservation(reservation);
                    }}
                  >
                    {reservation.client} - {reservation.inicial_time}
                  </ReservationTag>
                ))}
              </>
            )}
          </CalendarDay>
        ))}
      </CalendarContainer>
    );
  };

  const renderTimetable = () => {
    const filteredReservations = selectedDay 
      ? reservations.filter(r => 
          r.day === selectedDay && 
          r.month === currentDate.getMonth() + 1 && 
          r.year === currentDate.getFullYear()
        )
      : reservations;

    const sortedReservations = [...filteredReservations].sort((a, b) => {
      const dateA = new Date(`${a.year}-${a.month}-${a.day} ${a.inicial_time}`);
      const dateB = new Date(`${b.year}-${b.month}-${b.day} ${b.inicial_time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return (
      <TimetableContainer>
        <TimetableHeader>
          <div>Cliente</div>
          <div>Data</div>
          <div>Hora</div>
          <div>Status</div>
          <div>Ações</div>
        </TimetableHeader>
        {sortedReservations.map(reservation => (
          <TimetableRow key={reservation._id}>
            <div>{reservation.client}</div>
            <div>{`${reservation.day}/${reservation.month}/${reservation.year}`}</div>
            <div>{reservation.inicial_time}</div>
            <div>{reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}</div>
            <div>
              <Button $variant="primary" onClick={() => setSelectedReservation(reservation)}>
                Detalhes
              </Button>
            </div>
          </TimetableRow>
        ))}
      </TimetableContainer>
    );
  };

  return (
    <Container>
      <h1>Reservas</h1>
      <CalendarGrid>
        <Sidebar>
          <MonthSelector>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
              {'<'}
            </button>
            <div>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
              {'>'}
            </button>
          </MonthSelector>
        </Sidebar>
        {renderCalendar()}
      </CalendarGrid>
      {renderTimetable()}
      {renderReservationModal()}
    </Container>
  );
};