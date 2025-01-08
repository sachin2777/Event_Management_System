document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  loadAttendees();
});

function loadEvents() {
  fetch('http://localhost:8080/event')
      .then(response => response.json())
      .then(data => {
          const eventList = document.getElementById('eventsList');
          eventList.innerHTML = '';
          data.forEach(event => {
              const li = document.createElement('li');
              li.innerHTML = `${event.name} - ${event.description} - ${event.location} - ${event.date}
              <button onclick="editEvent(${event.id})">Edit</button>
              <button onclick="deleteEvent(${event.id})">Delete</button>`;
              eventList.appendChild(li);
          });
      });
}

document.getElementById('createEventForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const eventName = document.getElementById('eventName').value;
  const eventDescription = document.getElementById('eventDescription').value;
  const eventLocation = document.getElementById('eventLocation').value;
  const eventDate = document.getElementById('eventDate').value;

  if (!eventName || !eventDescription || !eventLocation || !eventDate) {
      document.getElementById('eventErrorMessages').innerText = 'All fields are required.';
      return;
  }

  const eventData = { name: eventName, description: eventDescription, location: eventLocation, date: eventDate };

  fetch('http://localhost:8080/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
  })
  .then(response => response.json())
  .then(() => {
      alert('Event created successfully');
      loadEvents();
      document.getElementById('createEventForm').reset();
  });
});

function editEvent(eventId) {
  const eventName = prompt('Edit event name:');
  const eventDescription = prompt('Edit event description:');
  const eventLocation = prompt('Edit event location:');
  const eventDate = prompt('Edit event date:');

  const updatedEvent = { name: eventName, description: eventDescription, location: eventLocation, date: eventDate };

  fetch(`http://localhost:8080/event/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent)
  })
  .then(response => response.json())
  .then(() => {
      alert('Event updated successfully');
      loadEvents();
  });
}

function deleteEvent(eventId) {
  fetch(`http://localhost:8080/event/${eventId}`, { method: 'DELETE' })
      .then(() => {
          alert('Event deleted successfully');
          loadEvents();
      });
}

function loadAttendees() {
  fetch('http://localhost:8080/attendee')
      .then(response => response.json())
      .then(data => {
          const attendeeSelector = document.getElementById('attendeeSelector');
          const attendeeSelectorTask = document.getElementById('attendeeSelectorTask');
          attendeeSelector.innerHTML = '';
          attendeeSelectorTask.innerHTML = '<option value="">Select Attendee</option>';

          data.forEach(attendee => {
              const option = document.createElement('option');
              option.value = attendee.id;
              option.textContent = attendee.name;
              attendeeSelector.appendChild(option);
              attendeeSelectorTask.appendChild(option.cloneNode(true));
          });
      });
}

document.getElementById('createAttendeeForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const attendeeName = document.getElementById('attendeeName').value;
  const attendeeGender = document.getElementById('attendeeGender').value;
  const eventId = document.getElementById('eventSelector').value;

  if (!attendeeName || !attendeeGender || !eventId) {
      document.getElementById('attendeeErrorMessages').innerText = 'All fields are required.';
      return;
  }

  const attendeeData = { name: attendeeName, gender: attendeeGender, event: { id: eventId } };

  fetch('http://localhost:8080/attendee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendeeData)
  })
  .then(response => response.json())
  .then(() => {
      alert('Attendee added successfully');
      loadAttendees();
      document.getElementById('createAttendeeForm').reset();
  });
});

document.getElementById('createTaskForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const taskName = document.getElementById('taskName').value;
  const attendeeId = document.getElementById('attendeeSelectorTask').value;
  const taskDeadline = document.getElementById('taskDeadline').value;

  if (!taskName || !attendeeId || !taskDeadline) {
      document.getElementById('taskErrorMessages').innerText = 'All fields are required.';
      return;
  }

  const taskData = { name: taskName, deadline: taskDeadline, attendee: { id: attendeeId } };

  fetch('http://localhost:8080/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
  })
  .then(response => response.json())
  .then(() => {
      alert('Task assigned successfully');
      loadAttendees();
      document.getElementById('createTaskForm').reset();
  });
});
