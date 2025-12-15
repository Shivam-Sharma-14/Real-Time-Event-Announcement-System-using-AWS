// Event form handling
const LAMBDA_FUNCTION_URL = 'https://susgfsukchl6al756kxvgouzv40sevab.lambda-url.eu-north-1.on.aws/';

document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value;
    const message = document.getElementById('eventMessage').value;
    const priority = document.getElementById('eventPriority').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
    submitBtn.disabled = true;
    
    try {
        console.log('Sending event to Lambda...');
        
        // Create the exact request structure that Lambda expects
        const requestData = {
            httpMethod: 'POST',
            body: JSON.stringify({
                title: title,
                message: message,
                priority: priority
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        console.log('Request data:', requestData);
        
        // Call your Lambda function with POST method
        const response = await fetch(LAMBDA_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                message: message,
                priority: priority
            })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const result = await response.json();
        console.log('Lambda Response:', result);
        
        if (response.ok) {
            addLogEntry('Event Published', 'Event "' + title + '" processed successfully - ID: ' + result.eventId, getCurrentTime(), true);
            alert('? Event published successfully!\nEvent ID: ' + result.eventId + '\nEmail sent: ' + (result.notificationSent ? 'Yes' : 'No'));
        } else {
            throw new Error(result.error || 'Failed to publish event');
        }
        
    } catch (error) {
        console.error('Error:', error);
        addLogEntry('Error', 'Failed to publish event: ' + error.message, getCurrentTime(), true);
        alert('? Error: ' + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
    
    document.getElementById('eventForm').reset();
});

document.getElementById('clearLog').addEventListener('click', function() {
    document.getElementById('logEntries').innerHTML = '<div class="log-entry"><div class="log-header"><div class="log-title">Log Cleared</div><div class="log-time">Just now</div></div><div class="log-message">Event log has been cleared</div></div>';
});

function addLogEntry(title, message, time, isNew = false) {
    const logEntries = document.getElementById('logEntries');
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + (isNew ? 'new' : '');
    entry.innerHTML = '<div class="log-header"><div class="log-title">' + title + '</div><div class="log-time">' + time + '</div></div><div class="log-message">' + message + '</div>';
    logEntries.insertBefore(entry, logEntries.firstChild);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString();
}

setTimeout(() => {
    addLogEntry('System Check', 'All AWS services responding normally', getCurrentTime());
}, 2000);

document.querySelectorAll('.auth-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
        if(this.classList.contains('btn-primary')) {
            alert('This would deploy the CloudFormation template to AWS in a real implementation.');
        } else {
            alert('This would redirect to AWS Console in a real implementation.');
        }
    });
});

document.querySelectorAll('.hero-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
        if(this.classList.contains('btn-primary')) {
            alert('This would deploy the EventStream stack to your AWS account.');
        } else {
            document.querySelector('.architecture').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    });
});
