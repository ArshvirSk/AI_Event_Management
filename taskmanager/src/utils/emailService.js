import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// Gmail API configuration
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const createTransporter = async () => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.REACT_APP_GMAIL_CLIENT_ID,
      process.env.REACT_APP_GMAIL_CLIENT_SECRET,
      process.env.REACT_APP_GMAIL_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REACT_APP_GMAIL_REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.REACT_APP_GMAIL_USER,
        clientId: process.env.REACT_APP_GMAIL_CLIENT_ID,
        clientSecret: process.env.REACT_APP_GMAIL_CLIENT_SECRET,
        refreshToken: process.env.REACT_APP_GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw error;
  }
};

export const sendTaskAssignmentEmail = async (task, teamMember) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.REACT_APP_GMAIL_USER,
      to: teamMember.email,
      subject: `Task Assignment: ${task.title}`,
      html: `
        <h2>New Task Assignment</h2>
        <p>Hello ${teamMember.name},</p>
        <p>You have been assigned a new task:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <h3>${task.title}</h3>
          <p><strong>Description:</strong> ${task.description}</p>
          <p><strong>Deadline:</strong> ${task.deadline}</p>
          <p><strong>Priority:</strong> ${task.priority}</p>
          <p><strong>Estimated Hours:</strong> ${task.estimatedHours}</p>
          <p><strong>Required Skills:</strong> ${task.requiredSkills.join(', ')}</p>
        </div>
        <p>Please review the task details and update your progress regularly.</p>
        <p>Best regards,<br>AI Task Manager</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending task assignment email:', error);
    throw error;
  }
};

export const sendTaskUpdateEmail = async (task, updateContent, teamMembers) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.REACT_APP_GMAIL_USER,
      to: teamMembers.map(member => member.email).join(','),
      subject: `Task Update: ${task.title}`,
      html: `
        <h2>Task Progress Update</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${updateContent}
        </div>
        <p>Best regards,<br>AI Task Manager</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending task update email:', error);
    throw error;
  }
};
