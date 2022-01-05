def save_files_to_disk(file_list, saved_file_info, upload_folder):
    for efile in file_list:
        file_data = file_list.get(efile)
        file_name = file_data.filename
        print("Saving filename: ", file_name)
        save_path = "{upload_folder}/{file_name}".format(upload_folder=upload_folder, file_name=file_name)
        content = file_data.read()
        with open(save_path, "wb") as binary_file:
            binary_file.write(content)
        saved_file_info[efile] = save_path
    return saved_file_info