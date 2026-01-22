// Enhanced Booking Calendar JavaScript

// Booking state
const bookingState = {
    currentStep: 1,
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    serviceName: '',
    price: 0,
    duration: 0
};

// Initialize booking system
function initBookingSystem() {
    // Service selection
    const serviceOptions = document.querySelectorAll('.service-option');
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            bookingState.selectedService = this.dataset.service;
            bookingState.serviceName = this.querySelector('h4').textContent;
            bookingState.price = this.dataset.price;
            bookingState.duration = this.dataset.duration;
            
            updateSummary();
        });
    });

    // Calendar
    initCalendar();
    
    // Navigation buttons
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevStep);
    }
    
    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
}

function nextStep() {
    if (bookingState.currentStep === 1 && !bookingState.selectedService) {
        alert('Please select a service first');
        return;
    }
    
    if (bookingState.currentStep === 2 && (!bookingState.selectedDate || !bookingState.selectedTime)) {
        alert('Please select a date and time');
        return;
    }
    
    if (bookingState.currentStep < 3) {
        bookingState.currentStep++;
        updateStepDisplay();
    }
}

function prevStep() {
    if (bookingState.currentStep > 1) {
        bookingState.currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${bookingState.currentStep}`).classList.add('active');
    
    // Update progress
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 < bookingState.currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === bookingState.currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    if (prevBtn) {
        prevBtn.style.display = bookingState.currentStep === 1 ? 'none' : 'flex';
    }
    
    if (nextBtn) {
        nextBtn.style.display = bookingState.currentStep === 3 ? 'none' : 'flex';
    }
}

// Calendar functions
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initCalendar() {
    renderCalendar(currentMonth, currentYear);
    
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }
}

function renderCalendar(month, year) {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');
    
    if (!calendarGrid || !calendarMonth) return;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    calendarMonth.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    calendarGrid.innerHTML = '';
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dayEl = createDayElement(day, 'other-month');
        calendarGrid.appendChild(dayEl);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        const isSunday = date.getDay() === 0;
        
        const dayEl = createDayElement(day, '');
        
        if (isToday) {
            dayEl.classList.add('today');
        }
        
        if (isPast || isSunday) {
            dayEl.classList.add('disabled');
        } else {
            dayEl.addEventListener('click', () => selectDate(date));
        }
        
        calendarGrid.appendChild(dayEl);
    }
    
    // Next month days
    const remainingDays = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) {
        const dayEl = createDayElement(day, 'other-month');
        calendarGrid.appendChild(dayEl);
    }
}

function createDayElement(day, className) {
    const dayEl = document.createElement('div');
    dayEl.className = `calendar-day ${className}`;
    dayEl.textContent = day;
    return dayEl;
}

function selectDate(date) {
    bookingState.selectedDate = date;
    
    // Update selected visual
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Update display
    const dateDisplay = document.getElementById('selectedDateDisplay');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = date.toLocaleDateString('en-US', options);
    }
    
    // Generate time slots
    generateTimeSlots(date);
    
    updateSummary();
}

function generateTimeSlots(date) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    const slots = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
        '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
        '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
        '5:00 PM', '5:30 PM', '6:00 PM'
    ];
    
    slots.forEach(time => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = time;
        
        // Randomly mark some as unavailable (in real app, check with backend)
        const isUnavailable = Math.random() > 0.7;
        if (isUnavailable) {
            slotEl.classList.add('unavailable');
        } else {
            slotEl.addEventListener('click', () => selectTimeSlot(time, slotEl));
        }
        
        timeSlotsContainer.appendChild(slotEl);
    });
}

function selectTimeSlot(time, element) {
    bookingState.selectedTime = time;
    
    // Update visual
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    element.classList.add('selected');
    
    updateSummary();
}

function updateSummary() {
    const summaryService = document.getElementById('summaryService');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryPrice = document.getElementById('summaryPrice');
    
    if (summaryService) {
        summaryService.textContent = bookingState.serviceName || '-';
    }
    
    if (summaryDate && bookingState.selectedDate) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        summaryDate.textContent = bookingState.selectedDate.toLocaleDateString('en-US', options);
    }
    
    if (summaryTime) {
        summaryTime.textContent = bookingState.selectedTime || '-';
    }
    
    if (summaryPrice) {
        summaryPrice.textContent = bookingState.price ? `₦${Number(bookingState.price).toLocaleString()}` : '₦0';
    }
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Populate hidden fields with booking data
    document.getElementById('hiddenService').value = bookingState.serviceName;
    document.getElementById('hiddenDate').value = bookingState.selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('hiddenTime').value = bookingState.selectedTime;
    document.getElementById('hiddenPrice').value = `₦${Number(bookingState.price).toLocaleString()}`;
    
    // Log for debugging
    console.log('Booking submitted:', {
        service: bookingState.serviceName,
        date: bookingState.selectedDate?.toLocaleDateString(),
        time: bookingState.selectedTime,
        price: bookingState.price
    });
    
    // Form will now submit to FormSubmit automatically
    // FormSubmit will redirect or show confirmation
    // No need to reset here as page will change
    e.target.submit();
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingSystem);
} else {
    initBookingSystem();
}
