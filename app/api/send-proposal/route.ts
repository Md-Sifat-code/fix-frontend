import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { clientEmail, proposalId, clientName, projectId, accessToken, contractDetails } = data

    // In a real implementation, this would:
    // 1. Save the proposal to a database
    // 2. Generate a unique access link
    // 3. Send an email to the client with the access link
    // 4. Return success with the access details

    // Generate a temporary password for portal access
    const tempPassword = Math.random().toString(36).slice(-8)

    // Create portal access URL
    const origin = request.headers.get("origin") || "https://architecture-simple.com"
    const portalUrl = `${origin}/client-portal/${projectId}?token=${accessToken}`

    // For demo purposes, log the email that would be sent
    console.log(`Sending proposal email to: ${clientEmail}`)

    // In a production environment, you would use a real email service
    // This is a demo implementation using nodemailer with Ethereal (fake SMTP service)
    let emailSent = false
    let emailInfo = null

    try {
      // Create a test account on Ethereal for demo purposes
      const testAccount = await nodemailer.createTestAccount()

      // Create a transporter using the test account
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })

      // Prepare email content
      const emailSubject = `Your Architecture Simple Proposal - ${proposalId}`
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Architecture Simple</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Dear ${clientName},</p>
            <p>Thank you for your interest in Architecture Simple. Your proposal (${proposalId}) has been prepared and is ready for your review.</p>
            <p>You can access your proposal, track project status, and submit payments through our client portal:</p>
            <div style="margin: 20px 0; text-align: center;">
              <a href="${portalUrl}" style="background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Access Client Portal</a>
            </div>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p>Project details:</p>
            <ul>
              <li><strong>Project Name:</strong> ${contractDetails?.projectName || "New Project"}</li>
              <li><strong>Project Type:</strong> ${contractDetails?.projectType || "N/A"}</li>
              <li><strong>Service Type:</strong> ${contractDetails?.serviceType || "N/A"}</li>
              <li><strong>Estimated Budget:</strong> ${contractDetails?.estimatedBudget || "N/A"}</li>
            </ul>
            <p>Please review the proposal at your earliest convenience. If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>Architecture Simple Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
            <p>This email was sent from Architecture Simple. © ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      `

      // Send the email
      const info = await transporter.sendMail({
        from: '"Architecture Simple" <proposals@architecturesimple.com>',
        to: clientEmail,
        subject: emailSubject,
        html: emailHtml,
      })

      emailSent = true
      emailInfo = {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
      }

      console.log("Email sent successfully:", emailInfo)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Continue with the response even if email fails
    }

    // Return success response with all the details
    return NextResponse.json({
      success: true,
      message: "Proposal sent successfully",
      data: {
        clientEmail,
        clientName,
        proposalId,
        projectId,
        accessToken,
        portalUrl,
        tempPassword,
        sentDate: new Date().toISOString(),
        emailSent,
        emailInfo,
        paymentLink: `${portalUrl}/payment`,
        trackingLink: `${portalUrl}/status`,
      },
    })
  } catch (error) {
    console.error("Error sending proposal:", error)
    return NextResponse.json({ success: false, message: "Failed to send proposal" }, { status: 500 })
  }
}
