// content.js - Enhanced College Form Autofiller with Bug Fixes
console.log("📥 College Form Autofiller script loaded");

// Comprehensive field mappings with extensive variations
const fieldMappings = {
  // USN variations
  'usn': ['USN', 'usn', 'University Seat Number', 'Student ID', 'Roll Number', 'Registration Number'],
  
  // Name variations - fixed to avoid overlap
  'name': [
    'FULL NAME', 'Full Name', 'Student Name', 'Complete Name',
    'Student Full Name', 'Your Name', 'Enter Name', 'Enter Full Name'
  ],
  'firstName': ['FIRST_NAME', 'First Name', 'First name', 'fname', 'Given Name'],
  'middleName': ['MIDDLE_NAME', 'Middle Name', 'Middle name', 'mname'],
  'lastName': ['LAST_NAME', 'Last Name', 'Last name', 'lname', 'Surname', 'Family Name'],
  
  // Contact information
  'email': [
    'E mail ID', 'EMAIL_ID', 'Email ID', 'Email', 'email', 'E-mail', 'Gmail ID',
    'Personal Email', 'Gmail', 'Mail ID', 'Email Address', 'Personal Mail',
    'only gmail', 'Ensure no typo mistakes'
  ],
  'collegeEmail': [
    'College mail id', 'College Email', 'Institutional Email', 'College Email ID',
    'University Email', 'Official Email', 'Academic Email'
  ],
  'phone': [
    'Mobile Number', 'MOBILE_NO', 'Mobile No', 'Phone Number', 'Contact Number',
    'Mobile Number (Only 10 Digit)', 'only 10 digits', '10 digits', 'Cell Number',
    'Phone', 'Mobile', 'Contact No'
  ],
  
  // Personal details
  'gender': ['Gender', 'GENDER', 'Sex', 'Male/Female', 'M/F'],
  'dob': [
    'Enter the date of birth', 'DOB', 'Date of Birth', 'Birth Date', 'Date',
    'Enter the date of birth (DD-MM-YYYY)', 'Date of Birth (DD-MM-YYYY)', 'DOB (DD-MM-YYYY)'
  ],
  
  // Academic details
  'tenth': [
    '10%', '10th %', 'SSLC %', 'Class 10 %', 'Tenth Percentage',
    '10th Percentage', 'SSC %', 'Matriculation %'
  ],
  'twelfth': [
    '12th / Diploma %', '12th/Diploma %', '12th %', 'PUC %', 'Class 12 %', 
    'HSC %', 'Diploma %', 'Higher Secondary %', 'Intermediate %',
    '12th Percentage', 'PU %'
  ],
  'course': [
    'Course', 'Program', 'Degree', 'Course Type'
  ],
  'branch': [
    'UG BRANCH', 'Branch', 'Department', 'Specialization', 'Stream',
    'Engineering Branch', 'Subject', 'Major', 'Field of Study',
    'UG Branch', 'Undergraduate Branch'
  ],
  'cgpa': [
    'CGPA', 'BE/B.TECH CGPA', 'UG CGPA', 'BE/B.TECH CGPA/UG', 'GPA',
    'Current CGPA', 'Overall CGPA', 'Aggregate CGPA'
  ],
  'mcaCgpa': ['MCA CGPA', 'PG CGPA', 'Masters CGPA', 'Post Graduate CGPA'],
  
  // Fixed placement and status fields
  'backlogs': [
    'Do you have any current backlogs', 'Current Backlogs', 'Backlogs', 'Any Backlogs',
    'current backlogs'
  ],
  'placementStatus': [
    'Are you placed', 'Placement Status', 'Job Status', 'placed',
    'Mention the company name and CTC'
  ],
  'neopatScore': [
    'NEOPAT SCORE LEVEL', 'NEOPAT Score', 'Aptitude Score', 'NEOPAT LEVEL',
    'Neo Pat Score', 'Neopat Level'
  ],
  'bootcampAttendance': [
    'Are you attending bootcamp training daily', 'Bootcamp Attendance', 'Training Attendance',
    'bootcamp training daily', 'Attendance of DSCE/DSATM/DSU'
  ],
  'bootcampProof': [
    'Upload proof of Bootcamp training attendance', 'Bootcamp proof', 'Training proof'
  ],
  
  // Location details
  'nativePlace': [
    'Native place', 'Native Place', 'Place of Birth', 'Hometown',
    'Birth Place', 'Origin', 'Home Town'
  ],
  'permanentAddress': [
    'Permanent address', 'Permanent Address', 'Address', 'Home Address',
    'Residential Address', 'Full Address'
  ],
  
  // Special categories
  'pwd': [
    'PWD', 'PWD(Persons with disabilities)', 'Persons with disabilities',
    'Disability Status', 'PWD - Yes/No', 'Persons with disabilities - Yes/No'
  ],
  'lgbtq': [
    'LGBTQ', 'LGBTQ (Yes/No)', 'LGBTQ+', 'Sexual Orientation',
    'LGBTQ - Yes/No'
  ],
  
  // Confirmation fields
  'confirmation': [
    'Confirmation', 'Confirm', 'Agreement', 'Agree', 'Accept'
  ],
  'declaration': [
    'Declaration', 'I have read', 'All details provided above are correct',
    'double checked before submission', 'Placement dept can take any action'
  ],
  'resume': [
    'Upload resume', 'Resume', 'CV', 'PDF FORMAT ONLY'
  ]
};

let savedFormData = {};

// Load saved data
chrome.storage.sync.get(["formData"], ({ formData }) => {
  if (formData) {
    savedFormData = formData;
    console.log("📋 Loaded form data:", savedFormData);
  }
});

// Enhanced matching function with priority system
function findMatchingFieldKey(questionText) {
  const normalizedQuestion = questionText.toLowerCase().trim();
  const cleanQuestion = normalizedQuestion.replace(/[*()[\]]/g, '').replace(/\s+/g, ' ').trim();
  
  // Priority matching - more specific matches first
  const priorityOrder = [
    'firstName', 'middleName', 'lastName', 'collegeEmail', 'email', 'usn', 
    'backlogs', 'bootcampAttendance', 'bootcampProof', 'placementStatus',
    'neopatScore', 'cgpa', 'mcaCgpa', 'branch', 'course', 'permanentAddress',
    'nativePlace', 'pwd', 'lgbtq', 'confirmation', 'declaration', 'resume',
    'name', 'dob', 'gender', 'phone', 'tenth', 'twelfth'
  ];
  
  for (const key of priorityOrder) {
    if (fieldMappings[key]) {
      for (const pattern of fieldMappings[key]) {
        const cleanPattern = pattern.toLowerCase().replace(/[*()[\]]/g, '').replace(/\s+/g, ' ').trim();
        
        if (
          cleanQuestion === cleanPattern ||
          cleanQuestion.includes(cleanPattern) ||
          cleanPattern.includes(cleanQuestion) ||
          matchesKeyWords(cleanQuestion, cleanPattern) ||
          fuzzyMatch(cleanQuestion, cleanPattern)
        ) {
          return key;
        }
      }
    }
  }
  
  return null;
}

// Helper function for word-based matching
function matchesKeyWords(question, pattern) {
  const questionWords = question.split(' ').filter(word => word.length > 2);
  const patternWords = pattern.split(' ').filter(word => word.length > 2);
  
  let matches = 0;
  for (const word of patternWords) {
    if (questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))) {
      matches++;
    }
  }
  
  return matches > 0 && matches >= Math.ceil(patternWords.length * 0.6);
}

// Helper function for fuzzy matching
function fuzzyMatch(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return true;
  
  const similarity = (longer.length - levenshteinDistance(longer, shorter)) / longer.length;
  return similarity > 0.8;
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// Fixed input field filling function
function fillInputField(input, value) {
  if (!input || !value) return false;
  
  try {
    // Clear any existing value first
    input.focus();
    input.value = '';
    
    // Use proper value setting for different input types
    const inputType = (input.type || 'text').toLowerCase();
    let processedValue = value.toString();
    
    // Handle specific input types
    if (inputType === 'number') {
      processedValue = parseFloat(processedValue) || processedValue;
    } else if (inputType === 'date' && processedValue.includes('-')) {
      // Convert DD-MM-YYYY to YYYY-MM-DD for date inputs
      const parts = processedValue.split('-');
      if (parts.length === 3 && parts[0].length <= 2) {
        processedValue = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    
    // Set value using multiple methods for compatibility
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, processedValue);
    }
    
    input.value = processedValue;
    
    // Trigger events
    const events = ['input', 'change', 'blur', 'keyup'];
    events.forEach(eventType => {
      const event = new Event(eventType, { bubbles: true, cancelable: true });
      input.dispatchEvent(event);
    });
    
    // Special handling for React/Vue
    const reactEvent = new Event('input', { bubbles: true });
    reactEvent.simulated = true;
    input.dispatchEvent(reactEvent);
    
    return true;
  } catch (error) {
    console.error('Error filling input field:', error);
    return false;
  }
}

// Enhanced dropdown handling
function fillDropdownField(container, value, questionContainer) {
  if (!container || !value) return false;
  
  const valueToMatch = value.toString().toLowerCase().trim();
  
  try {
    // Wait for dropdown to open
    setTimeout(() => {
      const options = document.querySelectorAll('[role="option"], option, .option-item, [data-value]');
      
      for (const option of options) {
        const optionText = (option.textContent || option.innerText || '').trim().toLowerCase();
        const dataValue = (option.getAttribute('data-value') || '').toLowerCase();
        
        if (optionText === valueToMatch || dataValue === valueToMatch || 
            optionText.includes(valueToMatch) || valueToMatch.includes(optionText)) {
          
          option.click();
          return true;
        }
      }
    }, 200);
    
    return false;
  } catch (error) {
    console.error('Error filling dropdown:', error);
    return false;
  }
}

// Enhanced radio button handling
function fillRadioField(container, value) {
  if (!container || !value) return false;
  
  const valueToMatch = value.toString().toLowerCase().trim();
  
  try {
    const radios = container.querySelectorAll('[role="radio"], input[type="radio"]');
    
    for (const radio of radios) {
      const radioLabel = radio.closest('label, [role="radiogroup"] > div');
      const labelText = radioLabel ? radioLabel.textContent.toLowerCase().trim() : '';
      const radioValue = (radio.value || '').toLowerCase();
      
      // Enhanced matching logic
      const isMatch = 
        labelText === valueToMatch ||
        radioValue === valueToMatch ||
        labelText.includes(valueToMatch) ||
        (valueToMatch === 'no' && labelText.includes('no')) ||
        (valueToMatch === 'yes' && labelText.includes('yes')) ||
        (valueToMatch === 'male' && labelText.includes('male')) ||
        (valueToMatch === 'female' && labelText.includes('female')) ||
        (valueToMatch === 'b.e' && (labelText.includes('b.e') || labelText.includes('bachelor'))) ||
        (valueToMatch === 'ise' && labelText.includes('information science'));
      
      if (isMatch) {
        radio.click();
        setTimeout(() => {
          // Double-check if selection worked
          if (!radio.checked) radio.click();
        }, 100);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error filling radio field:', error);
    return false;
  }
}

// Enhanced checkbox handling
function fillCheckboxField(container, value) {
  if (!container || !value) return false;
  
  const valueToMatch = value.toString().toLowerCase().trim();
  
  try {
    const checkboxes = container.querySelectorAll('[role="checkbox"], input[type="checkbox"]');
    
    for (const checkbox of checkboxes) {
      const checkboxLabel = checkbox.closest('label, [role="group"] > div');
      const labelText = checkboxLabel ? checkboxLabel.textContent.toLowerCase().trim() : '';
      
      if (labelText.includes(valueToMatch) || valueToMatch.includes(labelText)) {
        const shouldCheck = ['yes', 'true', '1', 'agree', 'confirm', 'accept'].includes(valueToMatch);
        const shouldUncheck = ['no', 'false', '0', 'disagree', 'decline'].includes(valueToMatch);
        
        if (shouldCheck && !checkbox.checked) {
          checkbox.click();
          return true;
        } else if (shouldUncheck && checkbox.checked) {
          checkbox.click();
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error filling checkbox field:', error);
    return false;
  }
}

// Enhanced data processing with field-specific logic
function getProcessedValue(key, originalValue) {
  const value = originalValue.toString().trim();
  
  switch (key) {
    case 'firstName':
      return value.split(' ')[0] || value;
    case 'middleName':
      const parts = value.split(' ');
      return parts.length > 2 ? parts.slice(1, -1).join(' ') : (parts.length === 2 ? '' : value);
    case 'lastName':
      const nameParts = value.split(' ');
      return nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    case 'collegeEmail':
      return savedFormData.collegeEmail || savedFormData.email || value;
    case 'backlogs':
      return savedFormData.backlogs || 'No';
    case 'bootcampAttendance':
      return savedFormData.bootcampAttendance || 'Yes';
    case 'placementStatus':
      return savedFormData.placementStatus || 'No';
    case 'confirmation':
      return 'Yes';
    case 'declaration':
      return 'Yes';
    default:
      return value;
  }
}

// Main autofill function with enhanced logic
function fillGoogleForm() {
  console.log("🔄 Starting autofill process...");
  
  if (Object.keys(savedFormData).length === 0) {
    console.log("❌ No saved data found");
    return;
  }
  
  let filledCount = 0;
  const processedQuestions = new Set();
  
  // Enhanced question detection
  const questionContainers = document.querySelectorAll('[role="listitem"], .freebirdFormviewerViewItemsItemItem');
  
  questionContainers.forEach((container, index) => {
    try {
      const questionElement = container.querySelector('[role="heading"], .freebirdFormviewerViewItemsItemItemTitle');
      const questionText = questionElement ? questionElement.textContent.trim() : '';
      
      if (!questionText || processedQuestions.has(questionText)) {
        return;
      }
      
      processedQuestions.add(questionText);
      console.log(`📝 Processing question ${index + 1}: "${questionText}"`);
      
      const matchedKey = findMatchingFieldKey(questionText);
      
      if (!matchedKey) {
        console.log(`⚠️ No match found for: "${questionText}"`);
        return;
      }
      
      const rawValue = savedFormData[matchedKey];
      if (!rawValue) {
        console.log(`⚠️ No data found for key: ${matchedKey}`);
        return;
      }
      
      const value = getProcessedValue(matchedKey, rawValue);
      console.log(`✅ Found match: ${matchedKey} = "${value}"`);
      
      let filled = false;
      
      // Try different input types in order of priority
      setTimeout(() => {
        // 1. Text inputs
        const textInputs = container.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, input:not([type])');
        if (textInputs.length > 0 && !filled) {
          for (const input of textInputs) {
            if (fillInputField(input, value)) {
              filled = true;
              filledCount++;
              console.log(`✅ Successfully filled: ${matchedKey} = "${value}"`);
              break;
            }
          }
        }
        
        // 2. Date inputs
        if (!filled && matchedKey === 'dob') {
          const dateInputs = container.querySelectorAll('input[type="date"]');
          for (const input of dateInputs) {
            if (fillInputField(input, value)) {
              filled = true;
              filledCount++;
              console.log(`✅ Successfully filled: ${matchedKey} = "${value}"`);
              break;
            }
          }
        }
        
        // 3. Radio buttons
        if (!filled && fillRadioField(container, value)) {
          filled = true;
          filledCount++;
          console.log(`✅ Successfully filled: ${matchedKey} = "${value}"`);
        }
        
        // 4. Dropdowns
        if (!filled) {
          const dropdowns = container.querySelectorAll('[role="listbox"], select, [role="button"][aria-haspopup="listbox"]');
          for (const dropdown of dropdowns) {
            dropdown.click();
            if (fillDropdownField(dropdown, value, container)) {
              filled = true;
              filledCount++;
              console.log(`✅ Successfully filled: ${matchedKey} = "${value}"`);
              break;
            }
          }
        }
        
        // 5. Checkboxes
        if (!filled && fillCheckboxField(container, value)) {
          filled = true;
          filledCount++;
          console.log(`✅ Successfully filled: ${matchedKey} = "${value}"`);
        }
        
        if (!filled) {
          console.log(`❌ Failed to fill: ${matchedKey} for question: "${questionText}"`);
        }
      }, 100 * index); // Stagger the filling to avoid conflicts
      
    } catch (error) {
      console.error(`❌ Error processing question ${index + 1}:`, error);
    }
  });
  
  // Final status
  setTimeout(() => {
    console.log(`🎉 Autofill completed! Successfully filled ${filledCount} fields.`);
    showNotification(`✅ Auto-filled ${filledCount} fields successfully!`, '#4CAF50');
  }, 3000);
}

// Enhanced notification system
function showNotification(message, color = '#4CAF50') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 10000;
    background: ${color}; color: white; padding: 15px 20px;
    border-radius: 8px; font-size: 16px; font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px; word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Message listener
window.addEventListener('message', (event) => {
  if (event.data.type === 'AUTOFILL_FORM') {
    chrome.storage.sync.get(["formData"], ({ formData }) => {
      if (formData) {
        savedFormData = formData;
        setTimeout(fillGoogleForm, 500);
      }
    });
  }
});

// Storage change listener
chrome.storage.onChanged.addListener((changes) => {
  if (changes.formData) {
    savedFormData = changes.formData.newValue || {};
    console.log("📋 Form data updated:", savedFormData);
  }
});

// Initialize
function init() {
  console.log("🚀 Initializing College Form Autofiller...");
  setTimeout(() => {
    if (savedFormData && Object.keys(savedFormData).length > 0) {
      fillGoogleForm();
    }
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}