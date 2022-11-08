import sgMail from "@sendgrid/mail"

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	sgMail.setApiKey(config.SENDGRID_KEY);
	const query = getQuery(event);

	const msg = {
		personalizations: [
			{
				to: query.email,
				dynamic_template_data: {
					name: query.name,
					email: query.email,
				},
			},
		],
		from: 'Pullonath <admin@pullonath.in>',
		// subject: '🍩 Donuts, at the big donut 🍩',
		templateId: "d-dcfbd2c5023546269903ccd2b74cc173",
	};
	return await sgMail.send(msg);
})