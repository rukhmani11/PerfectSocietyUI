
export const config = {
    formDataConfig: {
        headers: {
            "content-type": "multipart/form-data",
        }
    }
}

export const UserBackToListCallFrom = {
    'mySociety': 'mySociety',
    'society': 'society',
    'admin': 'admin'
}

export const ROLES = {
    'Admin': 'Admin',
    'Subscriber': 'Subscriber',
    'Society': 'Society',
    'ReadOnly': 'ReadOnly'
}

export const BillingFrequency = {
    'Monthly': 'M',
    'Bi-Monthly': 'B',
    'Quarterly': 'Q',
    'Half-Yearly': 'H',
    'Yearly': 'Y'
}

export const FolderPath = {
    'AdvertisementLogo': '/Advertisement',
    'QrcodeImage': '/Society'
}

export const Messages = {
    'SocietyUnSelected': 'Select Society before proceeding.'
}