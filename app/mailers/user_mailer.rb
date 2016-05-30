class UserMailer < ApplicationMailer
  def member_invite(user)
    @user = user
    @owner = user.owner
    mail to: user.email,
        subject: "You have been invited by #{@owner.name} on profitablity tools app"
  end

  def forgot_email(user)
    @user = user
    mail to: user.email,
        subject: "Password update on profitablity tools app"
  end
end